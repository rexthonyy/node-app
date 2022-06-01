const jwt = require('jsonwebtoken');
const fetch = require("node-fetch");
const pgKratosQueries = require("../../postgres/kratos-queries");
const { isEmailValid } = require("../../libs/util");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve) => {
        let redirectUrl = args.redirectUrl;
        let email = args.email.toLowerCase();
        let channel = args.channel;

        if (!isEmailValid(email)) return resolve(getError("email", "Email format not supported", "INVALID_CREDENTIALS", null));

        try {
            await getUserByEmail(email);
            await sendEmailConfirmation(email, redirectUrl);
            return resolve(getError("success", "Email confirmation sent. Check your inbox", "ACTIVATE_OWN_ACCOUNT", null));
        } catch (err) {
            return resolve(err);
        }
    });
}


function getError(field, message, code, addressType) {
    return {
        errors: [{
            field,
            message,
            code,
            addressType
        }],
        accountErrors: [{
            field,
            message,
            code,
            addressType
        }]
    };
}

async function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
        pgKratosQueries.getUserByEmail([email], result => {
            if (result.err) return reject(getError("email", "Failed to connect to DB", "INACTIVE", null));
            if (result.res.length == 0) return reject(getError("email", "Email is not registered", "NOT_FOUND", null));
            resolve();
        });
    });
}

async function sendEmailConfirmation(email, redirectUrl) {
    return new Promise((resolve, reject) => {
        pgKratosQueries.getUserByEmail([email], async result => {
            if (result.err || result.res.length == 0) return reject(getError("Account user", "User not found", "GRAPHQL_ERROR", null));
            let accountUser = result.res[0];
            let user_id = accountUser.id;
            let jwtTokenKey = accountUser.jwt_token_key;
            let requestType = "request-password-reset";

            let user = {
                user_id,
                email
            };
            let userToken = jwt.sign(user, jwtTokenKey);
            let confirmationData = {
                data: userToken
            };

            let token = jwt.sign(confirmationData, process.env.AUTHORIZATION_TOKEN_SECRET, { subject: user_id + "", expiresIn: process.env.JWT_TTL_REQUEST_EMAIL_CHANGE });

            let payload = {
                requestType,
                redirectUrl,
                email,
                token
            };

            try {
                let res = await fetch(process.env.LISTMONK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        query: ``,
                        variables: payload
                    })
                });

                let json = res.json();

                console.log(json);
            } catch (err) {
                console.log(err);
            }

            resolve();
        });
    });
}
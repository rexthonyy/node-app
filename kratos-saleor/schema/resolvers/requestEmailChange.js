const jwt = require('jsonwebtoken');
const fetch = require("node-fetch");
const pgKratosQueries = require("../../postgres/kratos-queries");
const { isEmailValid } = require("../../libs/util");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve) => {
        if (!context.user) return resolve(getError("authorization-bearer", "Please enter a valid authorization header", "JWT_INVALID_TOKEN", null));
        const authUser = context.user;

        let redirectUrl = args.redirectUrl;
        let newEmail = args.newEmail.toLowerCase();
        let password = args.password;
        let channel = args.channel;

        if (!isEmailValid(newEmail)) return resolve(getError("email", "Email format not supported", "INVALID_CREDENTIALS", null));

        try {
            await verifyEmailChangeRequest(authUser.id, password);
            await sendEmailChangeConfirmation(authUser.email, newEmail, redirectUrl);
            return resolve(getError("success", "Email confirmation sent. Check your inbox", "ACTIVATE_OWN_ACCOUNT", null));
        } catch (err) {
            return resolve(err);
        }
    });
}


function getError(field, message, code, addressType) {
    return {
        user: null,
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

function getResult(user) {
    return {
        user,
        errors: [{
            field: "",
            message: "",
            code: "",
            addressType: null
        }],
        accountErrors: [{
            field: "",
            message: "",
            code: "",
            addressType: null
        }]
    };
}

async function verifyEmailChangeRequest(userId, password) {
    return new Promise((resolve, reject) => {
        pgKratosQueries.getUserById([userId], result => {
            if (result.err) return reject(getError("email", "Failed to connect to DB", "INACTIVE", null));
            if (result.res.length == 0) return reject(getError("email", "Email is not registered", "NOT_FOUND", null));
            if (!bcrypt.compareSync(password, result.res[0].password)) return resolve(getError("password", "Invalid password", "INVALID_PASSWORD"));
            resolve();
        });
    });
}

async function sendEmailChangeConfirmation(email, newEmail, redirectUrl) {
    return new Promise((resolve, reject) => {
        pgKratosQueries.getUserByEmail([email], async result => {
            if (result.err || result.res.length == 0) return reject(getError("Account user", "User not found", "GRAPHQL_ERROR", null));
            let accountUser = result.res[0];
            let user_id = accountUser.id;
            let jwtTokenKey = accountUser.jwt_token_key;
            let requestType = "request-email-change";

            let user = {
                user_id,
                email,
                newEmail
            };

            let userToken = jwt.sign(user, jwtTokenKey);
            let confirmationData = {
                requestType,
                data: userToken
            };

            let token = jwt.sign(confirmationData, process.env.AUTHORIZATION_TOKEN_SECRET, { subject: user_id + "", expiresIn: process.env.JWT_TTL_REQUEST_EMAIL_CHANGE });
            console.log(token);
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

                //console.log(json);
            } catch (err) {
                //console.log(err);
            }

            resolve();
        });
    });
}
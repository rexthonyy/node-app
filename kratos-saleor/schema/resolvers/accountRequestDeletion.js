const jwt = require('jsonwebtoken');
const fetch = require("node-fetch");
const bcrypt = require("bcryptjs");
const pgKratosQueries = require("../../postgres/kratos-queries");
const { getGraphQLUserById } = require("./lib");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve) => {
        if (!context.user) return resolve(getError("authorization-bearer", "Please enter a valid authorization header", "JWT_INVALID_TOKEN", null));
        const authUser = context.user;

        let redirectUrl = args.redirectUrl;

        try {
            await sendConfirmation(authUser.email, redirectUrl);
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

async function sendConfirmation(email, redirectUrl) {
    return new Promise((resolve, reject) => {
        pgKratosQueries.getUserByEmail([email], result => {
            if (result.err || result.res.length == 0) return reject(getError("Account user", "User not found", "GRAPHQL_ERROR", null));
            let accountUser = result.res[0];
            let user_id = accountUser.id;
            let jwtTokenKey = accountUser.jwt_token_key;
            let requestType = "request-account-delete";

            let user = {
                user_id,
                email
            };

            let userToken = jwt.sign(user, jwtTokenKey);
            let confirmationData = {
                requestType,
                data: userToken
            };

            let token = jwt.sign(confirmationData, process.env.AUTHORIZATION_TOKEN_SECRET, { subject: user_id + "", expiresIn: process.env.JWT_TTL_REQUEST_ACCOUNT_DELETE });
            console.log(token);
            let payload = {
                requestType,
                redirectUrl,
                email,
                token
            };

            // try {
            //     let res = await fetch(process.env.LISTMONK_URL, {
            //         method: 'POST',
            //         headers: {
            //             'Content-Type': 'application/json'
            //         },
            //         body: JSON.stringify({
            //             query: ``,
            //             variables: payload
            //         })
            //     });

            //     let json = res.json();

            //     console.log(json);
            // } catch (err) {
            //     console.log(err);
            // }

            return resolve();
        });
    });
}
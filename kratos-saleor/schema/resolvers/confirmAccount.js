const jwt = require('jsonwebtoken');
const { isEmailValid } = require("../../libs/util");
const pgKratosQueries = require("../../postgres/kratos-queries");
const { getGraphQLUserById } = require("./lib");

module.exports = async(parent, args, context) => {
    return new Promise((resolve) => {
        let email = args.email;
        let token = args.token;

        if (!isEmailValid(email)) return resolve(getError("email", "Email format not supported", "INVALID_CREDENTIALS", null));

        jwt.verify(token, process.env.AUTHORIZATION_TOKEN_SECRET, (err, payload) => {
            if (err) return resolve(getError("token", "Email format not supported", "JWT_INVALID_TOKEN", null));
            let user_id = payload.sub;
            pgKratosQueries.getUserById([user_id], result => {
                if (result.err) return resolve(getError("token", "Email format not supported", "JWT_INVALID_TOKEN", null));
                let accountUser = result.res[0];
                jwt.verify(payload.data, accountUser.jwt_token_key, (err, user) => {
                    if (err) return resolve(getError("token", "Email format not supported", "JWT_DECODE_ERROR", user));
                    if (!(user.user_id == accountUser.id && user.email == email)) return resolve(getError("token", "Email format not supported", "JWT_DECODE_ERROR", user));
                    let values = [
                        user_id,
                        true
                    ];
                    pgKratosQueries.updateAccountUserActive(values, async result => {
                        if (result.err) return resolve(getError("failed to update user", result.err, "GRAPHQL_ERROR", user));
                        let graphQLUser = await getGraphQLUserById(accountUser.id);
                        resolve(getResult(graphQLUser));
                    });
                });
            });
        });
    });
}

function getError(field, message, code, addressType, user) {
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
        }],
        user
    };
}

function getResult(user) {
    return {
        errors: [{}],
        accountErrors: [{}],
        user
    };
}
const jwt = require('jsonwebtoken');
const { isEmailValid } = require("../../libs/util");
const pgKratosQueries = require("../../postgres/kratos-queries");
const { getGraphQLUserById } = require("./lib");

module.exports = async(parent, args, context) => {
    return new Promise((resolve) => {
        let token = args.token;

        jwt.verify(token, process.env.AUTHORIZATION_TOKEN_SECRET, (err, payload) => {
            if (err) return resolve(getError("token", "Invalid token", "JWT_INVALID_TOKEN", null));
            let user_id = payload.sub;
            pgKratosQueries.getUserById([user_id], result => {
                if (result.err) return resolve(getError("token", "User token invalid", "JWT_INVALID_TOKEN", null));
                let accountUser = result.res[0];
                jwt.verify(payload.data, accountUser.jwt_token_key, (err, user) => {
                    if (err) return resolve(getError("token", "User token decode error", "JWT_DECODE_ERROR", user));

                    let values = [
                        user_id,
                        user.newEmail
                    ];
                    pgKratosQueries.updateAccountUserEmail(values, async result => {
                        if (result.err) return resolve(getError("failed to update user", result.err, "GRAPHQL_ERROR", user));
                        let graphQLUser = await getGraphQLUserById(accountUser.id);
                        resolve(getResult(graphQLUser));
                    });
                });
            });
        });
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
            code: "INACTIVE",
            addressType: null
        }],
        accountErrors: [{
            field: "",
            message: "",
            code: "INACTIVE",
            addressType: null
        }]
    };
}
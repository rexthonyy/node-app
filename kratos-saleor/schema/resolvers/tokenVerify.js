const jwt = require('jsonwebtoken');
const pgKratosQueries = require("../../postgres/kratos-queries");
const { getGraphQLUserById } = require("./lib");

module.exports = async(parent, args, context) => {
    return new Promise((resolve) => {
        let token = args.token;
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) return resolve(getGraphQLOutput(null, false, null, "token", "Invalid json token", "JWT_INVALID_TOKEN", null));
            let user_id = payload.sub;
            pgKratosQueries.getUserById([user_id], result => {
                if (result.err) return resolve(getGraphQLOutput(null, true, null, "token", "User not found", "JWT_INVALID_TOKEN", null));
                let accountUser = result.res[0];
                jwt.verify(payload.data, accountUser.jwt_token_key, async(err, user) => {
                    if (err) return resolve(getGraphQLOutput(null, false, null, "token", "Invalid user token", "JWT_DECODE_ERROR", user));
                    let graphQLUser = await getGraphQLUserById(accountUser.id);
                    resolve(getGraphQLOutput(graphQLUser, true, null, null, "", "", ""));
                });
            });
        });
    });
}


function getGraphQLOutput(user, isValid, payload = null, field = null, message = null, code = null, addressType = null) {
    return {
        user,
        isValid,
        payload,
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
const jwt = require('jsonwebtoken');
const pgKratosQueries = require("../../postgres/kratos-queries");
const { getGraphQLUserById } = require("./lib");

module.exports = async(parent, args, context) => {
    return new Promise((resolve) => {
        let csrfToken = args.csrfToken;
        let refreshToken = args.refreshToken;

        if (csrfToken) {
            getAccessToken(resolve, csrfToken, process.env.CSRF_TOKEN_SECRET);
        } else if (refreshToken) {
            getAccessToken(resolve, refreshToken, process.env.REFRESH_TOKEN_SECRET);
        } else {
            resolve(getGraphQLOutput(null, null, "token", "Please enter a token", "JWT_MISSING_TOKEN", null));
        }
    });
}

function getAccessToken(resolve, token, key) {
    jwt.verify(token, key, (err, payload) => {
        if (err) return resolve(getGraphQLOutput(null, null, "token", "Invalid json token", "JWT_INVALID_TOKEN", null));
        let user_id = payload.sub;
        pgKratosQueries.getUserById([user_id], result => {
            if (result.err || result.res.length == 0) return resolve(getGraphQLOutput(null, null, "token", "User not found", "JWT_INVALID_TOKEN", null));
            let accountUser = result.res[0];
            jwt.verify(payload.data, accountUser.jwt_token_key, async(err, user) => {
                if (err) return resolve(getGraphQLOutput(null, false, "token", "Invalid user token", "JWT_DECODE_ERROR", user));

                let newUser = {
                    user_id: accountUser.id,
                    email: accountUser.email
                };

                let userToken = jwt.sign(newUser, accountUser.jwt_token_key);
                let confirmationData = {
                    data: userToken
                };

                let accessToken = jwt.sign(confirmationData, process.env.ACCESS_TOKEN_SECRET, { subject: accountUser.id + "", expiresIn: process.env.JWT_TTL_ACCESS });
                let graphQLUser = await getGraphQLUserById(accountUser.id);
                return resolve(getGraphQLOutput(accessToken, graphQLUser, "", "", "", null));
            });
        });
    });
}

function getGraphQLOutput(token, user, field = null, message = null, code = null, addressType = null) {
    return {
        token,
        user,
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
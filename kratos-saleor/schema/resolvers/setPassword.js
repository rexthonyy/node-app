const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const { isEmailValid } = require("../../libs/util");
const pgKratosQueries = require("../../postgres/kratos-queries");
const { getGraphQLUserById } = require("./lib");

module.exports = async(parent, args, context) => {
    return new Promise((resolve) => {
        let email = args.email;
        let password = args.password;
        let token = args.token;

        if (!isEmailValid(email)) return resolve(getError("email", "Email format not supported", "INVALID_CREDENTIALS", null));

        jwt.verify(token, process.env.AUTHORIZATION_TOKEN_SECRET, (err, payload) => {
            if (err) return resolve(getError("token", "Email format not supported", "JWT_INVALID_TOKEN", null));
            let user_id = payload.sub;
            pgKratosQueries.getUserById([user_id], result => {
                if (result.err) return resolve(getError("token", "User not found", "JWT_INVALID_TOKEN", null));
                let accountUser = result.res[0];
                jwt.verify(payload.data, accountUser.jwt_token_key, (err, user) => {
                    if (err) return resolve(getError("token", "Email format not supported", "JWT_DECODE_ERROR", null));
                    if (!(user.user_id == accountUser.id && user.email == email)) return resolve(getError("token", "User token invalid", "JWT_DECODE_ERROR", null));
                    let salt = bcrypt.genSaltSync(10);
                    let hash = bcrypt.hashSync(password, salt);
                    let values = [
                        user.user_id,
                        hash
                    ];
                    pgKratosQueries.updateAccountUserPassword(values, async result => {
                        if (result.err) return resolve(getError("failed to update user", result.err, "GRAPHQL_ERROR", user));

                        let newUser = {
                            user_id: accountUser.id,
                            email: accountUser.email
                        };

                        let userToken = jwt.sign(newUser, accountUser.jwt_token_key);
                        let confirmationData = {
                            data: userToken
                        };

                        let accessToken = jwt.sign(confirmationData, process.env.ACCESS_TOKEN_SECRET, { subject: accountUser.id + "", expiresIn: process.env.JWT_TTL_ACCESS });
                        let refreshToken = jwt.sign(confirmationData, process.env.REFRESH_TOKEN_SECRET, { subject: accountUser.id + "", expiresIn: process.env.JWT_TTL_REFRESH });
                        let csrfToken = jwt.sign(confirmationData, process.env.CSRF_TOKEN_SECRET, { subject: accountUser.id + "", expiresIn: process.env.JWT_TTL_REFRESH });

                        let graphQLUser = await getGraphQLUserById(accountUser.id);
                        resolve(getResult(accessToken, refreshToken, csrfToken, graphQLUser));
                    });
                });
            });
        });
    });
}

function getError(field, message, code, addressType) {
    return {
        token: null,
        refreshToken: null,
        csrfToken: null,
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

function getResult(token, refreshToken, csrfToken, user) {
    return {
        token,
        refreshToken,
        csrfToken,
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
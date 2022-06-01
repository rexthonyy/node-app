const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const { isEmailValid } = require("../../libs/util");
const pgKratosQueries = require("../../postgres/kratos-queries");
const { getGraphQLUserById } = require("./lib");

module.exports = async(parent, args, context) => {
    return new Promise((resolve) => {
        let email = args.email.toLowerCase();
        let password = args.password;

        if (!isEmailValid(email)) return resolve(getError("email", "Email format not supported", "INVALID_CREDENTIALS"));

        pgKratosQueries.getUserByEmail([email], async result => {
            if (result.err || result.res.length == 0) return resolve(getError("email", "Email not registered", "INVALID"));
            let accountUser = result.res[0];
            if (!accountUser.is_active) return resolve(getError("credentials", "Email not confirmed", "ACCOUNT_NOT_CONFIRMED"));
            if (!bcrypt.compareSync(password, accountUser.password)) return resolve(getError("password", "Password mismatch", "INVALID_PASSWORD"));

            let user = {
                id: accountUser.id,
                email: accountUser.email
            };

            let userToken = jwt.sign(user, accountUser.jwt_token_key);
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

function getResult(token, refreshToken, csrfToken, user) {
    return {
        token,
        refreshToken,
        csrfToken,
        user,
        errors: [{}],
        accountErrors: [{}]
    };
}
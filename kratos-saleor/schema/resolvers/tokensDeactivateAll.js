const jwt = require('jsonwebtoken');
const { authenticator } = require('otplib');
const pgKratosQueries = require("../../postgres/kratos-queries");
const { getGraphQLUserById } = require("./lib");

module.exports = async(parent, args, context) => {
    console.log(context.user.id);
    console.log(context.user.firstName);
    return new Promise((resolve) => {
        let jwt_token_key = authenticator.generateSecret().substring(0, 12);
        let values = [
            accountUser.id,
            jwt_token_key
        ];
        pgKratosQueries.updateAccountUserJWTTokenKey(values, async result => {
            if (result.err) return resolve(getGraphQLOutput(null, null, "token", "Failed to refresh token", "GRAPHQL_ERROR", null));
            let newUser = {
                user_id: accountUser.id,
                email: accountUser.email
            };

            let userToken = jwt.sign(newUser, jwt_token_key);
            let confirmationData = {
                data: userToken
            };

            let accessToken = jwt.sign(confirmationData, process.env.ACCESS_TOKEN_SECRET, { subject: accountUser.id + "", expiresIn: process.env.JWT_TTL_ACCESS });
            let graphQLUser = await getGraphQLUserById(accountUser.id);
            return resolve(getGraphQLOutput(accessToken, graphQLUser, "", "", "", null));
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
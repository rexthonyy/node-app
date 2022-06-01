const { authenticator } = require('otplib');
const pgKratosQueries = require("../../postgres/kratos-queries");

module.exports = async(parent, args, context) => {
    return new Promise((resolve) => {
        if (!context.user) return resolve(getGraphQLOutput("authorization-bearer", "Please enter a valid authorization header", "JWT_INVALID_TOKEN", null));
        let authUser = context.user;

        let jwt_token_key = authenticator.generateSecret().substring(0, 12);
        let values = [
            authUser.id,
            jwt_token_key
        ];
        pgKratosQueries.updateAccountUserJWTTokenKey(values, async result => {
            if (result.err) return resolve(getGraphQLOutput("token", "Failed to update user jwt_token_key", "GRAPHQL_ERROR", null));
            return resolve(getGraphQLOutput("success", "All tokens deactivated", "DONE", null));
        });
    });
}

function getGraphQLOutput(field = null, message = null, code = null, addressType = null) {
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
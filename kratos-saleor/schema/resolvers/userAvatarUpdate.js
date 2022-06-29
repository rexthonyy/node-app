const pgKratosQueries = require("../../postgres/kratos-queries");
module.exports = async(parent, args, context) => {
    return new Promise((resolve, reject) => {
        if (!context.user) return resolve(getGraphQLOutput("authorization-bearer", "Please enter a valid authorization header", "JWT_INVALID_TOKEN", null, null));
        const authUser = context.user;

        let avatar = args.imageHTML;

        pgKratosQueries.updateAccountUserById([authUser.id, avatar], "avatar=$2", result => {
            return resolve(getGraphQLOutput("", "", "INVALID", "", authUser));
        });
    });
}


function getGraphQLOutput(field, message, code, addressType, user) {
    return {
        user: user,
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
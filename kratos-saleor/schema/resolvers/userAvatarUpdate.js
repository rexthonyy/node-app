const pgKratosQueries = require("../../postgres/kratos-queries");
const getGraphQLUserById = require("./lib/getGraphQLUserById");
module.exports = async(parent, args, context) => {
    return new Promise((resolve, reject) => {
        if (!context.user) return resolve(getGraphQLOutput("authorization-bearer", "Please enter a valid authorization header", "JWT_INVALID_TOKEN", null, null));
        const authUser = context.user;

        let req = context;
        req.files.map(function(file) {
            pgKratosQueries.updateAccountUserById([authUser.id, file.location], "avatar=$2", async result => {
                let graphQLUser = await getGraphQLUserById(authUser.id);
                return resolve(getGraphQLOutput("", "", "INVALID", "", graphQLUser));
            });
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
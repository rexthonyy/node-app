const pgKratosQueries = require("../../postgres/kratos-queries");

module.exports = async(parent, args, context) => {
    return new Promise((resolve) => {
        if (!context.user) return resolve(getGraphQLOutput("authorization-bearer", "Please enter a valid authorization header", "JWT_INVALID_TOKEN", null, null));
        const authUser = context.user;

        let userIds = args.ids;
        let isActive = args.isActive;
        const numIds = userIds.length;
        let idCursor = -1;

        userIds.forEach(userId => {
            pgKratosQueries.updateAccountUserById([userId, isActive], "is_active=$2", result => {
                checkComplete();
            });
        });

        checkComplete();

        function checkComplete() {
            idCursor++;
            if (idCursor == numIds) {
                resolve(getGraphQLOutput("", "", "INVALID", null, numIds));
            }
        }
    });
}

function getGraphQLOutput(field, message, code, addressType, count) {
    return {
        count,
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
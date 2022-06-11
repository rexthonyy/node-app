const pgKratosQueries = require("../../postgres/kratos-queries");

module.exports = async(parent, args, context) => {
    return new Promise((resolve) => {
        if (!context.user) return resolve(getGraphQLOutput("authorization-bearer", "Please enter a valid authorization header", "JWT_INVALID_TOKEN", null, null, null));
        const authUser = context.user;

        let id = args.id;
        let type = args.type;

        pgKratosQueries.getAccountAddressById([id], async result => {
            if (result.err) return resolve(getGraphQLOutput("graphql error", "Failed to fetch address", "GRAPHQL_ERROR", null, null, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("graphql error", "Address not found", "NOT_FOUND", null, null, null));

            if (type == "BILLING") {
                pgKratosQueries.updateAccountUserById([authUser.id, id], "default_billing_address_id=$2", async result => {
                    if (result.err) { console.log(result.err); return resolve(getGraphQLOutput("graphql error", "Failed to update default billing address", "GRAPHQL_ERROR", null, null, null)); }
                    return resolve(getGraphQLOutput("", "", "INVALID", type, authUser));
                });
            } else if (type == "SHIPPING") {
                pgKratosQueries.updateAccountUserById([authUser.id, id], "default_shipping_address_id=$2", async result => {
                    if (result.err) { console.log(result.err); return resolve(getGraphQLOutput("graphql error", "Failed to update default shipping address", "GRAPHQL_ERROR", null, null, null)); }
                    return resolve(getGraphQLOutput("", "", "INVALID", type, authUser));
                });
            } else {
                return resolve(getGraphQLOutput("type", "type must be either BILLING or SHIPPING", "INVALID", null, null, null));
            }

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
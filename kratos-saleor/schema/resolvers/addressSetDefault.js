const pgKratosQueries = require("../../postgres/kratos-queries");
const { getGraphQLUserById } = require("./lib");

module.exports = async(parent, args, context) => {
    return new Promise((resolve) => {
        if (!context.user) return resolve(getGraphQLOutput("authorization-bearer", "Please enter a valid authorization header", "JWT_INVALID_TOKEN", null, null, null));
        const authUser = context.user;

        let addressId = args.addressId;
        let type = args.type;
        let userId = args.userId;

        pgKratosQueries.getAccountAddressById([addressId], async result => {
            if (result.err) return resolve(getGraphQLOutput("graphql error", "Failed to fetch address", "GRAPHQL_ERROR", null, null, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("graphql error", "Address not found", "NOT_FOUND", null, null, null));

            if (type == "BILLING") {
                pgKratosQueries.updateAccountUserById([userId, addressId], "default_billing_address_id=$2", async result => {
                    if (result.err) { console.log(result.err); return resolve(getGraphQLOutput("graphql error", "Failed to update default billing address", "GRAPHQL_ERROR", null, null, null)); }
                    let graphQLUser = await getGraphQLUserById(userId);
                    return resolve(getGraphQLOutput("", "", "INVALID", type, graphQLUser));
                });
            } else if (type == "SHIPPING") {
                pgKratosQueries.updateAccountUserById([userId, addressId], "default_shipping_address_id=$2", async result => {
                    if (result.err) { console.log(result.err); return resolve(getGraphQLOutput("graphql error", "Failed to update default shipping address", "GRAPHQL_ERROR", null, null, null)); }
                    let graphQLUser = await getGraphQLUserById(userId);
                    return resolve(getGraphQLOutput("", "", "INVALID", type, graphQLUser));
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
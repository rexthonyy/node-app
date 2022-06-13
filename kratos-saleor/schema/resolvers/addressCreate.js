const pgKratosQueries = require("../../postgres/kratos-queries");
const { getGraphQLUserById } = require("./lib");
const userPermissionGroupHasAccess = require("./lib/userPermissionGroupHasAccess");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        if (!context.user) return resolve(getGraphQLOutput("authorization-bearer", "Please enter a valid authorization header", "JWT_INVALID_TOKEN", null, null, null));
        const authUser = context.user;

        if (authUser.userPermissions.find(permission => permission.code == "MANAGE_USERS")) {
            resolve(await addressCreate(args));
        } else if (userPermissionGroupHasAccess(authUser.permissionGroups, ["MANAGE_USERS"])) {
            resolve(await addressCreate(args));
        } else {
            resolve(getGraphQLOutput("permission", "You do not have permission to perform this operation", "OUT_OF_SCOPE_PERMISSION", null, null, null));
        }
    });
}

function addressCreate(args) {
    return new Promise(resolve => {
        let input = args.input;
        let userId = args.userId;

        let values = [
            input.firstName,
            input.lastName,
            input.companyName,
            input.streetAddress1,
            input.streetAddress2,
            input.city,
            input.postalCode,
            input.country,
            input.countryArea,
            input.phone,
            input.cityArea
        ];

        pgKratosQueries.getUserById([userId], result => {
            if (result.err || result.res.length == 0) return resolve(getGraphQLOutput("user_id", "User not found", "NOT_FOUND", null, null, null));
            pgKratosQueries.createAccountAddress(values, result => {
                if (result.err || result.res.length == 0) return resolve(getGraphQLOutput("graphql error", "Failed to add account address", "GRAPHQL_ERROR", null, null, null));
                let accountAddress = result.res[0];
                pgKratosQueries.createAccountUserAddress([userId, accountAddress.id], async result => {
                    if (result.err || result.res.length == 0) return resolve(getGraphQLOutput("graphql error", "Failed to add account address to user", "GRAPHQL_ERROR", null, null, null));
                    let graphQLUser = await getGraphQLUserById(userId);
                    let defaultBillingAddress = graphQLUser.defaultBillingAddress;
                    let isDefaultBillingAddress = defaultBillingAddress ? (defaultBillingAddress.id == accountAddress.id) : false;
                    let defaultShippingAddress = graphQLUser.defaultShippingAddress;
                    let isDefaultShippingAddress = defaultShippingAddress ? (defaultShippingAddress.id == accountAddress.id) : false;
                    let address = {
                        id: accountAddress.id,
                        firstName: accountAddress.first_name,
                        lastName: accountAddress.last_name,
                        companyName: accountAddress.company_name,
                        streetAddress1: accountAddress.street_address_1,
                        streetAddress2: accountAddress.street_address_2,
                        city: accountAddress.city,
                        cityArea: accountAddress.city_area,
                        postalCode: accountAddress.postal_code,
                        country: accountAddress.country,
                        countryArea: accountAddress.country_area,
                        phone: accountAddress.phone,
                        isDefaultShippingAddress,
                        isDefaultBillingAddress
                    };

                    return resolve(getGraphQLOutput("", "", "INVALID", "", graphQLUser, address));
                });
            });
        });
    });
}

function getGraphQLOutput(field, message, code, addressType, user, address) {
    return {
        user: user,
        address: address,
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
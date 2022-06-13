const pgKratosQueries = require("../../postgres/kratos-queries");
const { updateAccountUserDefaultAddressesByUserId } = require("./lib");
const userPermissionGroupHasAccess = require("./lib/userPermissionGroupHasAccess");
const getAddressOwnerId = require("./lib/getAddressOwnerId");

module.exports = (parent, args, context) => {
    return new Promise(async resolve => {
        if (!context.user) return resolve(getGraphQLOutput("authorization-bearer", "Please enter a valid authorization header", "JWT_INVALID_TOKEN", null, null, null));
        const authUser = context.user;

        let id = args.id;

        if (authUser.userPermissions.find(permission => permission.code == "MANAGE_USERS")) {
            resolve(await deleteAccountAddress(id));
        } else if (userPermissionGroupHasAccess(authUser.permissionGroups, ["MANAGE_USERS"])) {
            resolve(await deleteAccountAddress(id));
        } else {
            let addressOwnerId = await getAddressOwnerId(id);
            if (authUser.id == addressOwnerId) {
                resolve(await deleteAccountAddress(id));
            } else {
                resolve(getGraphQLOutput("permission", "You do not have permission to perform this operation", "OUT_OF_SCOPE_PERMISSION", null, null, null));
            }
        }
    });
}

function deleteAccountAddress(id) {
    return new Promise(resolve => {
        pgKratosQueries.getAccountAddressById([id], async result => {
            if (result.err) return resolve(getGraphQLOutput("graphql error", "Failed to fetch address", "GRAPHQL_ERROR", null, null, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("graphql error", "Address not found", "NOT_FOUND", null, null, null));
            if (authUser.defaultBillingAddress != null && authUser.defaultBillingAddress.id == Number(id)) {
                await updateUserDefaultAddress(authUser.id, "default_billing_address_id=$2", null);
            }
            if (authUser.defaultShippingAddress != null && authUser.defaultShippingAddress.id == Number(id)) {
                await updateUserDefaultAddress(authUser.id, "default_shipping_address_id=$2", null);
            }

            pgKratosQueries.deleteAccountUserAddressesByUserIdAndAddressId([authUser.id, id], result => {
                pgKratosQueries.deleteAccountAddressById([id], async result => {
                    if (result.err) return console.log(result.err);
                    let defaultBillingAddress = authUser.defaultBillingAddress;
                    let isDefaultBillingAddress = defaultBillingAddress ? (defaultBillingAddress.id == accountAddress.id) : false;
                    let defaultShippingAddress = authUser.defaultShippingAddress;
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
                    return resolve(getGraphQLOutput("", "", "INVALID", "", authUser, address));
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


function updateUserDefaultAddress(userId, whereClause, addressId) {
    return new Promise((resolve) => {
        pgKratosQueries.updateAccountUserById([userId, addressId], whereClause, result => {
            resolve();
        });
    });
}
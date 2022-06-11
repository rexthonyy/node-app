const pgKratosQueries = require("../../postgres/kratos-queries");
const { updateAccountUserDefaultAddressesByUserId } = require("./lib");

module.exports = async(parent, args, context) => {
    return new Promise((resolve) => {
        if (!context.user) return resolve(getGraphQLOutput("authorization-bearer", "Please enter a valid authorization header", "JWT_INVALID_TOKEN", null, null, null));
        const authUser = context.user;

        let id = args.id;
        pgKratosQueries.getAccountAddressById([id], async result => {
            if (result.err) return resolve(getGraphQLOutput("graphql error", "Failed to fetch address", "GRAPHQL_ERROR", null, null, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("graphql error", "Address not found", "NOT_FOUND", null, null, null));
            let accountAddress = result.res[0];
            pgKratosQueries.deleteAccountUserAddressesByUserIdAndAddressId([authUser.id, id], result => {
                pgKratosQueries.deleteAccountAddressById([id], result => {
                    if (result.err) return console.log(result.err);
                    await updateAccountUserDefaultAddressesByUserId(authUser.id);
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
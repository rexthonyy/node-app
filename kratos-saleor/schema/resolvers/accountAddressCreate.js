const pgKratosQueries = require("../../postgres/kratos-queries");
const { getGraphQLUserById } = require("./lib");

module.exports = async(parent, args, context) => {
    return new Promise((resolve) => {
        if (!context.user) return resolve(getGraphQLOutput("authorization-bearer", "Please enter a valid authorization header", "JWT_INVALID_TOKEN", null, null, null));
        const authUser = context.user;

        let input = args.input;
        let type = args.type;

        let values = [
            input.firstName,
            input.lastName,
            input.companyName,
            input.streetAddress1,
            input.streetAddress2,
            input.city,
            input.cityArea,
            input.postalCode,
            input.country,
            input.countryArea,
            input.phone
        ];

        console.log(values);

        pgKratosQueries.createAccountAddress(values, result => {
            console.log("create address");
            console.log(result.err);
            console.log(result.res);
            if (result.err || result.res.length == 0) return resolve(getGraphQLOutput("graphql error", "Failed to add account address", "GRAPHQL_ERROR", null, null, null));
            let accountAddress = result.res[0];
            pgKratosQueries.createAccountUserAddress([authUser.id, accountAddress.id], async result => {
                console.log("create user address");
                if (result.err || result.res.length == 0) return resolve(getGraphQLOutput("graphql error", "Failed to add account address to user", "GRAPHQL_ERROR", null, null, null));
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
                    isDefaultShippingAddress: false,
                    isDefaultBillingAddress: false
                };
                return resolve(getGraphQLOutput("", "", "INVALID", type, authUser, address));
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
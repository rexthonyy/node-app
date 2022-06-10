const pgKratosQueries = require("../../postgres/kratos-queries");

module.exports = async(parent, args, context) => {
    return new Promise((resolve) => {
        if (!context.user) return resolve(getGraphQLOutput("authorization-bearer", "Please enter a valid authorization header", "JWT_INVALID_TOKEN", null, null, null));
        const authUser = context.user;

        let id = args.id;
        let input = args.input;


        let inputValue = [id];
        let { values, whereClause } = getValuesForAccountAddressUpdateFromInput(inputValue, input);

        pgKratosQueries.getAccountAddressById([id], async result => {
            if (result.err) return resolve(getGraphQLOutput("graphql error", "Failed to fetch address", "GRAPHQL_ERROR", null, null, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("graphql error", "Address not found", "NOT_FOUND", null, null, null));

            pgKratosQueries.updateAccountAddressById(values, whereClause, result => {
                if (result.err) { console.log(result.err); return resolve(getGraphQLOutput("graphql error", "Failed to update account address", "GRAPHQL_ERROR", null, null, null)); }

                pgKratosQueries.getAccountAddressById([id], async result => {
                    if (result.err) return resolve(getGraphQLOutput("graphql error", "Failed to fetch address", "GRAPHQL_ERROR", null, null, null));
                    let accountAddress = result.res[0];
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

function getValuesForAccountAddressUpdateFromInput(values, input) {
    let whereClause = "";

    if (input.firstName) {
        values.push(input.firstName);
        if (whereClause) whereClause += ", ";
        whereClause += `first_name=$${values.length}`;
    }
    if (input.lastName) {
        values.push(input.lastName);
        if (whereClause) whereClause += ", ";
        whereClause += `last_name=$${values.length}`;
    }
    if (input.companyName) {
        values.push(input.companyName);
        if (whereClause) whereClause += ", ";
        whereClause += `company_name=$${values.length}`;
    }
    if (input.streetAddress1) {
        values.push(input.streetAddress1);
        if (whereClause) whereClause += ", ";
        whereClause += `street_address_1=$${values.length}`;
    }
    if (input.streetAddress2) {
        values.push(input.streetAddress2);
        if (whereClause) whereClause += ", ";
        whereClause += `street_address_2=$${values.length}`;
    }
    if (input.city) {
        values.push(input.city);
        if (whereClause) whereClause += ", ";
        whereClause += `city=$${values.length}`;
    }
    if (input.postalCode) {
        values.push(input.postalCode);
        if (whereClause) whereClause += ", ";
        whereClause += `postal_code=$${values.length}`;
    }
    if (input.country) {
        values.push(input.country);
        if (whereClause) whereClause += ", ";
        whereClause += `country=$${values.length}`;
    }
    if (input.countryArea) {
        values.push(input.countryArea);
        if (whereClause) whereClause += ", ";
        whereClause += `country_area=$${values.length}`;
    }
    if (input.phone) {
        values.push(input.phone);
        if (whereClause) whereClause += ", ";
        whereClause += `phone=$${values.length}`;
    }
    if (input.cityArea) {
        values.push(input.cityArea);
        if (whereClause) whereClause += ", ";
        whereClause += `city_area=$${values.length}`;
    }

    return { values, whereClause };
}
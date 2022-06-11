const pgKratosQueries = require("../../postgres/kratos-queries");

module.exports = (parent, args, context) => {
    return new Promise((resolve, reject) => {
        if (!context.user) return resolve(getGraphQLOutput("authorization-bearer", "Please enter a valid authorization header", "JWT_INVALID_TOKEN", null, null));
        const authUser = context.user;

        let input = args.input;
        let inputValue = [authUser.id];
        let { values, whereClause } = getValuesForAccountUserUpdateFromInput(inputValue, input);

        pgKratosQueries.updateAccountUserById(values, whereClause, async result => {
            if (result.err) { console.log(result.err); return resolve(getGraphQLOutput("graphql error", "Failed to update account user", "GRAPHQL_ERROR", null, null, null)); }
            await updateDefaultBillingAddress(authUser, input);
            await updateDefaultShippingAddress(authUser, input);
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

function getValuesForAccountUserUpdateFromInput(values, input) {
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
    if (input.languageCode) {
        values.push(input.languageCode);
        if (whereClause) whereClause += ", ";
        whereClause += `language_code=$${values.length}`;
    }

    return { values, whereClause };
}

function updateDefaultBillingAddress(authUser, input) {
    return new Promise((resolve) => {
        if (!input.defaultBillingAddress) return resolve();
        if (!authUser.defaultBillingAddress) return resolve();
        let addressId = authUser.defaultBillingAddress.id;
        pgKratosQueries.getAccountAddressById([addressId], result => {
            if (result.err || result.res.length == 0) return resolve();
            let inputValue = [addressId];
            let { values, whereClause } = getValuesForAccountAddressUpdateFromInput(inputValue, input.defaultBillingAddress);
            pgKratosQueries.updateAccountAddressById(values, whereClause, result => {
                if (result.err) { console.log(result.err); return resolve(); }
                resolve();
            });
        });
    });
}

function updateDefaultShippingAddress(authUser, input) {
    return new Promise((resolve) => {
        if (!input.defaultShippingAddress) return resolve();
        if (!authUser.defaultShippingAddress) return resolve();
        let addressId = authUser.defaultShippingAddress.id;
        pgKratosQueries.getAccountAddressById([addressId], result => {
            if (result.err || result.res.length == 0) return resolve();
            let inputValue = [addressId];
            let { values, whereClause } = getValuesForAccountAddressUpdateFromInput(inputValue, input.defaultShippingAddress);
            pgKratosQueries.updateAccountAddressById(values, whereClause, result => {
                if (result.err) { console.log(result.err); return resolve(); }
                resolve();
            });
        });
    });
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
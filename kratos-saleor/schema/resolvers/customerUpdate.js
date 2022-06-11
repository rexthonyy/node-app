const pgKratosQueries = require("../../postgres/kratos-queries");
const { isEmailValid } = require("../../libs/util");
const { getGraphQLUserById } = require("./lib");

module.exports = (parent, args, context) => {
    return new Promise((resolve, reject) => {
        if (!context.user) return resolve(getGraphQLOutput("authorization-bearer", "Please enter a valid authorization header", "JWT_INVALID_TOKEN", null, null));
        const authUser = context.user;

        let userId = args.id;
        let input = args.input;

        if (args.input.email)
            if (!isEmailValid(args.input.email)) return resolve(getGraphQLOutput("email", "Email format not supported", "INVALID_CREDENTIALS", null, null));

        let inputValue = [userId];
        let { values, whereClause } = getValuesForCustomerUpdateFromInput(inputValue, input);

        pgKratosQueries.updateAccountUserById(values, whereClause, async result => {
            if (result.err) { console.log(result.err); return resolve(getGraphQLOutput("graphql error", "Failed to update account user", "GRAPHQL_ERROR", null, null)); }
            let graphQLUser = await getGraphQLUserById(userId);
            await updateDefaultBillingAddress(graphQLUser, input);
            await updateDefaultShippingAddress(graphQLUser, input);
            graphQLUser = await getGraphQLUserById(userId);
            return resolve(getGraphQLOutput("", "", "INVALID", "", graphQLUser));
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

function getValuesForCustomerUpdateFromInput(values, input) {
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
    if (input.email) {
        values.push(input.email);
        if (whereClause) whereClause += ", ";
        whereClause += `email=$${values.length}`;
    }
    if (input.languageCode) {
        values.push(input.languageCode);
        if (whereClause) whereClause += ", ";
        whereClause += `language_code=$${values.length}`;
    }
    if (input.isActive) {
        values.push(input.isActive);
        if (whereClause) whereClause += ", ";
        whereClause += `is_active=$${values.length}`;
    }
    if (input.note) {
        values.push(input.note);
        if (whereClause) whereClause += ", ";
        whereClause += `note=$${values.length}`;
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
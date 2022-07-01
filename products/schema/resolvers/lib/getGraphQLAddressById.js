const kratosQueries = require("../../../postgres/kratos-queries");
let getGraphQLAddressById = (id, authUser = null) => {
    return new Promise((resolve, reject) => {
        kratosQueries.getAccountAddress([id], "id=$1", result => {
            if (result.err || result.res.length == 0) {
                reject(null);
            } else {
                let address = result.res[0];

                resolve({
                    id: address.id,
                    firstName: address.first_name,
                    lastName: address.last_name,
                    companyName: address.company_name,
                    streetAddress1: address.street_address_1,
                    streetAddress2: address.street_address_2,
                    city: address.city,
                    cityArea: address.city_area,
                    postalCode: address.postal_code,
                    country: {
                        code: address.country,
                        country: address.country,
                        vat: null
                    },
                    countryArea: address.country_area,
                    phone: address.phone,
                    isDefaultShippingAddress: authUser ? authUser.default_shipping_address_id == address.id : false,
                    isDefaultBillingAddress: authUser ? authUser.default_billing_address_id == address.id : false
                });
            }
        });
    });
};

module.exports = getGraphQLAddressById;
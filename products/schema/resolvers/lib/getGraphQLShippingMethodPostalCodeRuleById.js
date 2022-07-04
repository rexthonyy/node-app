const productQueries = require("../../../postgres/product-queries");

let getGraphQLShippingMethodPostalCodeRuleById = (id) => {
    return new Promise((resolve, reject) => {
        productQueries.getShippingMethod([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                reject(null);
            } else {
                let shippingMethodPostalCodeRule = result.res[0];

                let res = {
                    id: shippingMethodPostalCodeRule.id,
                    start: shippingMethodPostalCodeRule.start,
                    end: shippingMethodPostalCodeRule.end,
                    inclusionType: shippingMethodPostalCodeRule.inclusion_type
                };

                resolve(res);
            }
        });
    });
};

module.exports = getGraphQLShippingMethodPostalCodeRuleById;
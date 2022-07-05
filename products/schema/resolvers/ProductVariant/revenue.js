const {
    getGraphQLProductVariantTranslationById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let productVariantId = parent.id;
        let period = args.period;
        resolve(getRevenue(productVariantId, period));
    });
}

function getRevenue(productVariantId, period) {
    return new Promise((resolve, reject) => {
        resolve({
            currency: "USD",
            gross: {
                currency: "USD",
                amount: 1.0
            },
            net: {
                currency: "USD",
                amount: 1.0
            },
            tax: {
                currency: "USD",
                amount: 1.0
            }
        });
    });
}
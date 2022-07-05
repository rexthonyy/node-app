const {
    getGraphQLProductVariantTranslationById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let productVariantId = parent.id;
        let address = args.address;
        resolve(getPricing(productVariantId, address));
    });
}

function getPricing(productVariantId, address) {
    return new Promise((resolve, reject) => {
        resolve({
            onSale: true,
            discount: {
                currency: "USD",
                gross: {
                    currency: "USD",
                    amount: 1.0
                }
            },
            discountLocalCurrency: {
                currency: "USD",
                gross: {
                    currency: "USD",
                    amount: 1.0
                }
            },
            price: {
                currency: "USD",
                gross: {
                    currency: "USD",
                    amount: 1.0
                }
            },
            priceUndiscounted: {
                currency: "USD",
                gross: {
                    currency: "USD",
                    amount: 1.0
                }
            },
            priceLocalCurrency: {
                currency: "USD",
                gross: {
                    currency: "USD",
                    amount: 1.0
                }
            }
        });
    });
}
const {
    getGraphQLProductVariantTranslationById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let productId = parent.id;
        let address = args.address;
        resolve(getPricing(productId, address));
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
                },
                net: {
                    currency: "USD",
                    amount: 1.0
                },
                tax: {
                    currency: "USD",
                    amount: 1.0
                },
            },
            discountLocalCurrency: {
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
                },
            },
            priceRange: {
                start: {
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
                    },
                },
                stop: {
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
                    },
                },
            },
            priceRangeUndiscounted: {
                start: {
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
                    },
                },
                stop: {
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
                    },
                },
            },
            priceRangeLocalCurrency: {
                start: {
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
                    },
                },
                stop: {
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
                    },
                },
            },
        });
    });
}
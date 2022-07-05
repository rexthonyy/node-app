const {
    getGraphQLStockById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let productVariantId = parent.id;
        let address = args.address;
        let countryCode = args.countryCode;
        resolve(getQuantityAvailable(productVariantId, address, countryCode));
    });
}

function getQuantityAvailable(productVariantId, address, countryCode) {
    return new Promise((resolve, reject) => {
        resolve(0);
    });
}
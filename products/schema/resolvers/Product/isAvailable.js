const {
    getGraphQLProductVariantTranslationById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let productId = parent.id;
        let address = args.address;
        resolve(getIsAvailable(productId, address));
    });
}

function getIsAvailable(productVariantId, address) {
    return new Promise((resolve, reject) => {
        resolve(true);
    });
}
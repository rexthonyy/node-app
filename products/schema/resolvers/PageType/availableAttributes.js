const {
    getGraphQLProductVariantTranslationById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let productTypeId = parent.id;
        let variantSelection = args.variantSelection;
        resolve(getAssignedVariantAttributes(productTypeId, variantSelection));
    });
}

function getAssignedVariantAttributes(productTypeId, variantSelection) {
    return new Promise((resolve, reject) => {
        resolve(null);
    });
}
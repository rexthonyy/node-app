const {
    getGraphQLSelectedAttributeByProductVariantId
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let productVariantId = parent.id;
        let variantSelection = args.variantSelection;
        console.log(args);
        resolve(getAttributes(productVariantId, variantSelection));
    });
}

function getAttributes(productVariantId, variantSelection) {
    return new Promise(async(resolve, reject) => {
        let attributes;
        try {
            attributes = await getGraphQLSelectedAttributeByProductVariantId(productVariant.id);
        } catch (err) {
            attributes = null;
        }
        resolve(attributes);
    });
}
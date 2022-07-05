const {
    getGraphQLProductVariantTranslationById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let productVariantId = parent.id;
        let languageCode = args.languageCode;
        resolve(getTranslation(productVariantId, languageCode));
    });
}

function getTranslation(productVariantId, languageCode) {
    return new Promise((resolve, reject) => {
        productQueries.getProductVariantTranslation([productVariantId, languageCode], "product_variant_id=$1 AND language_code=$2", async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return resolve(null);
            let translation = result.res[0];
            try {
                resolve(await getGraphQLProductVariantTranslationById(translation.id));
            } catch (err) {
                resolve(null);
            }
        });
    });
}
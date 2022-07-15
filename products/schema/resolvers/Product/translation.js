const {
    checkAuthorization,
    getGraphQLProductTranslationById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let productId = parent.id;
        let languageCode = args.languageCode;
        resolve(getTranslation(productId, languageCode));
    });
}

function getTranslation(productId, languageCode) {
    return new Promise((resolve, reject) => {
        productQueries.getProductTranslation([productId, languageCode], "product_id=$1 AND language_code=$2", async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return resolve(null);
            let translation = result.res[0];
            resolve(await getGraphQLProductTranslationById(translation.id));
        });
    });
}
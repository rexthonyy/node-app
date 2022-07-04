const {
    checkAuthorization,
    getGraphQLCollectionTranslationById
} = require('./lib');
const productQueries = require("../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return reject(message);

        let collectionId = parent.id;
        let languageCode = args.languageCode;
        resolve(getTranslation(collectionId, languageCode));
    });
}

function getTranslation(collectionId, languageCode) {
    return new Promise((resolve, reject) => {
        productQueries.getCollectionTranslation([collectionId, languageCode], "collection_id=$1 AND language_code=$2", async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return resolve(null);
            let translation = result.res[0];
            resolve(await getGraphQLCollectionTranslationById(translation.id));
        });
    });
}
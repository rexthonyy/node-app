const {
    checkAuthorization,
    getGraphQLCollectionTranslationById
} = require('./lib');
const productQueries = require("../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return reject(message);

        let languageCode = args.languageCode;
        console.log(languageCode);
        resolve(getTranslation(languageCode));
    });
}

function getTranslation(languageCode) {
    return new Promise((resolve, reject) => {
        productQueries.getCollectionTranslation([languageCode], "language_code=$1", async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject(`Could'nt resolve languageCode: ${languageCode}`);
            let translation = result.res[0];
            resolve(await getGraphQLCollectionTranslationById(translation.id));
        });
    });
}
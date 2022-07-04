const productQueries = require("../../../postgres/product-queries");

let getGraphQLCollectionTranslationById = (id) => {
    return new Promise((resolve, reject) => {
        productQueries.getCollectionTranslation([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                return reject("Collection translation not found");
            }

            let collectionTranslation = result.res[0];

            let res = {
                id: collectionTranslation.id,
                language: {
                    code: collectionTranslation.language_code,
                    language: collectionTranslation.name
                },
                seoTitle: collectionTranslation.seo_title,
                seoDescription: collectionTranslation.seo_description,
                name: collectionTranslation.name,
                description: collectionTranslation.description,
                descriptionJson: collectionTranslation.description
            };

            resolve(res);
        });
    });
};

module.exports = getGraphQLCollectionTranslationById;
const productQueries = require("../../../postgres/product-queries");

let getGraphQLProductTranslationById = (id) => {
    return new Promise((resolve, reject) => {
        productQueries.getProductTranslation([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                return reject("Product translation not found");
            }

            let productTranslation = result.res[0];

            let res = {
                id: productTranslation.id,
                language: {
                    code: productTranslation.language_code,
                    language: productTranslation.name
                },
                seoTitle: productTranslation.seo_title,
                seoDescription: productTranslation.seo_description,
                name: productTranslation.name,
                description: productTranslation.description,
                descriptionJson: productTranslation.description
            };

            resolve(res);
        });
    });
};

module.exports = getGraphQLProductTranslationById;
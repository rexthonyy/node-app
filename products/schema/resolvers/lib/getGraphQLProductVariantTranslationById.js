const productQueries = require("../../../postgres/product-queries");

let getGraphQLProductVariantTranslationById = (id) => {
    return new Promise((resolve, reject) => {
        productQueries.getProductVariantTranslation([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                return reject("Product variant translation not found");
            }

            let translation = result.res[0];

            resolve({
                id: translation.id,
                language: {
                    code: translation.language_code,
                    language: translation.name,
                },
                name: translation.name,
            });
        });
    });
};

module.exports = getGraphQLProductVariantTranslationById;
const productQueries = require("../../../postgres/product-queries");
let getGraphQLCategoryTranslationByCategoryId = (categoryId) => {
    return new Promise(async(resolve, reject) => {
        if (categoryId == null) return resolve(null);
        productQueries.getCategoryTranslation([categoryId], "category_id=$1", result => {
            if (result.err || result.res.length == 0) {
                return reject("Category translation not found");
            }

            let trans = result.res[0];

            let res = {
                id: trans.id,
                language: trans.language_code,
                seoTitle: trans.seo_title,
                seoDescription: trans.seo_description,
                name: trans.name,
                description: trans.description,
                descriptionJson: trans.description
            };

            resolve(res);
        });
    });
};

module.exports = getGraphQLCategoryTranslationByCategoryId;
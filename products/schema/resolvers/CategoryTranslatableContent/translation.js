const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let categoryId = parent.id;
        let languageCode = args.languageCode;
        resolve(getTranslation(categoryId, languageCode));
    });
}

function getTranslation(categoryId, languageCode) {
    return new Promise((resolve, reject) => {
        productQueries.getCategoryTranslation([categoryId, languageCode], "category_id=$1 AND language_code=$2", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return resolve(null);
            let translation = result.res[0];
            resolve({
                id: translation.id,
                language: {
                    code: translation.language_code,
                    language: translation.name
                },
                seoTitle: translation.seo_title,
                seoDescription: translation.seo_description,
                name: translation.name,
                description: translation.description,
                descriptionJson: translation.description
            });
        });
    });
}
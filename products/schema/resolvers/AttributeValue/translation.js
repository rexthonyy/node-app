const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let attributeValueId = parent.id;
        let languageCode = args.languageCode;
        resolve(getTranslation(attributeValueId, languageCode));
    });
}

function getTranslation(attributeValueId, languageCode) {
    return new Promise((resolve, reject) => {
        productQueries.getAttributeValueTranslation([attributeValueId, languageCode], "attribute_value_id=$1 AND language_code=$2", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return resolve(null);
            let translation = result.res[0];
            resolve({
                id: translation.id,
                language: {
                    code: translation.language_code,
                    language: translation.name
                },
                name: translation.name,
                richText: translation.rich_text
            })
        });
    });
}
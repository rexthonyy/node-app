const productQueries = require("../../../postgres/product-queries");
const getGraphQLProductAttributeById = require("./getGraphQLProductAttributeById");

let getGraphQLAttributeValueById = (id) => {
    return new Promise(async(resolve, reject) => {
        productQueries.getAttributeValue([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                return reject("Attribute value not found");
            }

            let attributeValue = result.res[0];
            let translation;
            let attribute;

            try {
                translation = await getTranslation(attributeValue.id);
            } catch (err) {
                translation = null;
            }
            try {
                attribute = await getGraphQLProductAttributeById(attributeValue.attribute_id);
            } catch (err) {
                attribute = {};
            }

            resolve({
                id: attributeValue.id,
                name: attributeValue.name,
                slug: attributeValue.slug,
                value: attributeValue.value,
                translation,
                inputType: attribute.input_type || "",
                reference: attributeValue.reference_product_id,
                file: {
                    url: attributeValue.file_url,
                    contentType: attributeValue.content_type
                },
                richText: attributeValue.rich_text,
                boolean: attributeValue.boolean,
                date: attributeValue.date_time,
                dateTime: attributeValue.date_time
            });
        });

    });
};

function getTranslation(id) {
    return new Promise(resolve => {
        productQueries.getAttributeValueTranslation([id], "attribute_value_id=$1", async result => {
            if (result.err || result.res.length == 0) {
                return reject("Attribute value translation not found");
            }

            let translation = result.res[0];

            resolve({
                id: translation.id,
                language: {
                    code: translation.language_code,
                    language: translation.name
                },
                name: translation.name,
                richText: translation.rich_text
            });
        });
    });
}

module.exports = getGraphQLAttributeValueById;
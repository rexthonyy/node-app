const productQueries = require("../../../postgres/product-queries");
const getGraphQLProductAttributeById = require("./getGraphQLProductAttributeById");

let getGraphQLSelectedAttributesByProductVariantId = (productId) => {
    return new Promise((resolve, reject) => {
        productQueries.getAttributeValue([productId], "reference_product_id=$1", async result => {
            if (result.err || result.res.length == 0) {
                return reject("Attribute value not found");
            }

            let attributeValues = result.res;
            let attributeId = attributeValues[0].attribute_id;
            let attribute = await getGraphQLProductAttributeById(attributeId);
            let values = [];
            const numAttributeValues = attributeValues.length;
            let cursor = -1;

            attributeValues.forEach(attrVal => {
                values.push({
                    id: attrVal.id,
                    name: attrVal.name,
                    slug: attrVal.slug,
                    value: attrVal.value,
                    translation: null,
                    inputType: null,
                    reference: attrVal.reference_product_id,
                    file: attrVal.file_url,
                    richText: attrVal.richText,
                    boolean: attrVal.boolean,
                    date: attrVal.date_time,
                    dateTime: attrVal.date_time
                });
                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numAttributeValues) {
                    resolve({
                        attribute,
                        values
                    });
                }
            }
        });
    });
};

module.exports = getGraphQLSelectedAttributesByProductVariantId;
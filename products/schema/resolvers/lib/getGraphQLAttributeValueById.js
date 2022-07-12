const productQueries = require("../../../postgres/product-queries");

let getGraphQLAttributeValueById = (id) => {
    return new Promise(async(resolve, reject) => {
        productQueries.getAttributeValue([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                return reject("Attribute value not found");
            }
            let attributeValue = result.res[0];
            productQueries.getAttribute([attributeValue.attribute_id], "id=$1", result => {
                if (result.err || result.res.length == 0) {
                    return reject("Attribute not found");
                }
                let attribute = result.res[0];

                resolve({
                    id: attributeValue.id,
                    name: attributeValue.name,
                    slug: attributeValue.slug,
                    value: attributeValue.value,
                    inputType: attribute.input_type,
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
    });
};

module.exports = getGraphQLAttributeValueById;
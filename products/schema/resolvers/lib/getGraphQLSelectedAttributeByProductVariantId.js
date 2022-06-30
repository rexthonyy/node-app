const productQueries = require("../../../postgres/product-queries");
const getGraphQLProductAttributeById = require("./getGraphQLProductAttributeById");
const getGraphQLAttributeValueById = require("./getGraphQLAttributeValueById");

let getGraphQLSelectedAttributeByProductVariantId = (id) => {
    return new Promise(async(resolve, reject) => {

        let attribute;
        let values;

        try {
            await getAttribute(id);
        } catch (err) {
            attribute = null;
        }

        try {
            await getValues(id);
        } catch (err) {
            values = null;
        }

        resolve({
            attribute,
            values
        });



        productQueries.getAttributeValue([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                return reject("Attribute value not found");
            }

            let attributeValue = result.res[0];
            let translation;
            let attr;

            try {
                translation = await getTranslation(attributeValue.id);
            } catch (err) {
                translation = null;
            }
            try {
                attr = await getGraphQLProductAttributeById(attributeValue.attribute_id);
            } catch (err) {
                attr = {};
            }

            resolve({
                id: attributeValue.id,
                name: attributeValue.name,
                slug: attributeValue.slug,
                value: attributeValue.value,
                translation,
                inputType: attr.input_type || "",
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


function getAttribute(id) {
    return new Promise(resolve => {
        productQueries.getAssignedVariantAttribute([id], "variant_id=$1", async result => {
            if (result.err || result.res.length == 0) {
                return reject("Assigned variant attribute not found");
            }

            let assignedVariantAttribute = result.res[0];

            productQueries.getAttributeVariant([assignedVariantAttribute.assignment_id], "id=$1", async result => {
                if (result.err || result.res.length == 0) {
                    return reject("Attribute variant not found");
                }

                let attributeId = result.res[0].attribute_id;
                try {
                    resolve(await getGraphQLProductAttributeById(attributeId));
                } catch (err) {
                    return reject(err);
                }
            });
        });
    });
}

function getValues(id) {
    return new Promise(resolve => {
        productQueries.getAssignedVariantAttribute([id], "variant_id=$1", async result => {
            if (result.err || result.res.length == 0) {
                return reject("Assigned variant attribute not found");
            }

            let assignedVariantAttribute = result.res[0];

            productQueries.getAssignedVariantAttributeValue([assignedVariantAttribute.id], "assignment_id=$1", result => {
                if (result.err) {
                    return reject("Assigned Variant Attribute value not found");
                }

                let assignedVariantAttributeValues = result.res;
                const numAssignedVariantAttributeValues = assignedVariantAttributeValues.length;
                let cursor = -1;
                let values = [];

                assignedVariantAttributeValues.forEach(async assignedVariantAttributeValue => {
                    try {
                        values.push(await getGraphQLAttributeValueById(assignedVariantAttributeValue.value_id));
                    } catch (err) {
                        console.log(err);
                    }
                    checkComplete();
                });

                checkComplete();

                function checkComplete() {
                    cursor++;
                    if (cursor == numAssignedVariantAttributeValues) {
                        resolve(values);
                    }
                }
            });
        });
    });
}

module.exports = getGraphQLSelectedAttributeByProductVariantId;
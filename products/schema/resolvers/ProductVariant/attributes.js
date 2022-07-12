const {
    getGraphQLAttributeById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");
const getGraphQLAttributeValueById = require('../lib/getGraphQLAttributeValueById');

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let productVariantId = parent.id;
        let variantSelection = args.variantSelection || "ALL";
        resolve(getAttributes(productVariantId, variantSelection));
    });
}

function getAttributes(productVariantId, variantSelection) {
    return new Promise(async(resolve, reject) => {
        productQueries.getAssignedVariantAttribute([productVariantId], "variant_id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return resolve(null);
            let assignedVariantAttributes = result.res;
            const numAssignedVariantAttributes = assignedVariantAttributes.length;
            let cursor = -1;
            let selectedAttributes = [];

            assignedVariantAttributes.forEach(async assignedVariantAttribute => {
                try {
                    selectedAttributes.push(await getSelectedAttribute(variantSelection, assignedVariantAttribute));
                } catch (err) {}
                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numAssignedVariantAttributes) {
                    resolve(selectedAttributes);
                }
            }
        });
    });
}

function getSelectedAttribute(variantSelection, assignedVariantAttribute) {
    return new Promise(async(resolve, reject) => {
        let assignmentId = assignedVariantAttribute.assignment_id;
        let whereClause = "id=$1";
        let values = [assignmentId];
        if (variantSelection != "ALL") {
            if (variantSelection == "VARIANT_SELECTION") {
                whereClause = " AND variant_selection=$2";
                values.push(true);
            } else if (variantSelection == "NOT_VARIANT_SELECTION") {
                whereClause = " AND variant_selection=$2";
                values.push(false);
            }
        }
        productQueries.getAttributeVariant(values, whereClause, result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return resolve(null);
            let attributeVariant = result.res[0];
            let attributeId = attributeVariant.attribute_id;
            productQueries.getAttribute([attributeId], "id=$1", async result => {
                if (result.err) return reject(JSON.stringify(result.err));
                if (result.res.length == 0) return resolve(null);
                let graphQLAttribute;
                let graphQLValues;
                try {
                    graphQLAttribute = await getGraphQLAttributeById(attributeId);
                    graphQLValues = await getValues(attributeId);

                    resolve({
                        attribute: graphQLAttribute,
                        values: graphQLValues
                    });
                } catch (err) {
                    return resolve(null);
                }
            });
        });
    });
}

function getValues(attributeId) {
    return new Promise((resolve, reject) => {
        productQueries.getAttributeValue([attributeId], "attribute_id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject(null);
            let attributeValues = result.res;
            const numAttributeValues = attributeValues.length;
            let cursor = -1;
            let graphQLAttributeValues = [];

            attributeValues.forEach(async attributeValue => {
                graphQLAttributeValues.push(await getGraphQLAttributeValueById(attributeValue.id));
                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numAttributeValues) {
                    resolve(graphQLAttributeValues);
                }
            }
        });
    });
}
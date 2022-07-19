const {
    checkAuthorization,
    getGraphQLAttributeById,
    getGraphQLAttributeValueById,
    getGraphQLProductTypeById,
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let attributeId = parent.id;
        resolve(await productVariantTypes(args, attributeId));
    });
}

function productVariantTypes(args, attributeId) {
    return new Promise(async(resolve, reject) => {
        try {
            let edges = await getAllProductVariantTypes(attributeId);
            resolve({
                pageInfo: {
                    hasNextPage: false,
                    hasPreviousPage: false,
                    startCursor: "",
                    endCursor: ""
                },
                edges,
                totalCount: edges.length
            });
        } catch (err) {
            reject(err);
        }
    });
}

function getAllProductVariantTypes(attributeId) {
    return new Promise((resolve, reject) => {
        productQueries.getAttributeVariant([attributeId], "attribute_id=$1", result => {
            if (result.err) { console.log(JSON.stringify(result.err)); return reject(JSON.stringify(result.err)); }
            let attributeVariants = result.res;

            const numAttributeVariants = attributeVariants.length;
            let cursor = -1;
            let edges = [];

            attributeVariants.forEach(async attributeVariant => {
                let node = await getGraphQLProductTypeById(attributeVariant.product_type_id);
                edges.push({
                    cursor: "",
                    node
                });

                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numAttributeVariants) {
                    resolve(edges);
                }
            }
        });
    })
}
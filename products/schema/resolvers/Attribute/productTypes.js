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
        resolve(await productTypes(args, attributeId));
    });
}

function productTypes(args, attributeId) {
    return new Promise(async(resolve, reject) => {
        try {
            let edges = await getAllProductTypes(attributeId);
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

function getAllProductTypes(attributeId) {
    return new Promise((resolve, reject) => {
        productQueries.getAttributeProduct([attributeId], "attribute_id=$1", result => {
            if (result.err) { console.log(JSON.stringify(result.err)); return reject(JSON.stringify(result.err)); }
            let attributeProducts = result.res;

            const numAttributeProducts = attributeProducts.length;
            let cursor = -1;
            let edges = [];

            attributeProducts.forEach(async attributeProduct => {
                let node = await getGraphQLProductTypeById(attributeProduct.product_type_id);
                edges.push({
                    cursor: "",
                    node
                });

                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numAttributeProducts) {
                    resolve(edges);
                }
            }
        });
    })
}
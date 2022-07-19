const {
    checkAuthorization,
    getGraphQLAttributeById,
    getGraphQLAttributeValueById,
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let attributeId = parent.id;
        resolve(await choices(args, attributeId));
    });
}

function choices(args, attributeId) {
    return new Promise(async(resolve, reject) => {
        try {
            let edges = await getAllChoices(attributeId);
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

function getAllChoices(attributeId) {
    return new Promise((resolve, reject) => {
        productQueries.getAttributeValue([attributeId], "attribute_id=$1", result => {
            if (result.err) { console.log(JSON.stringify(result.err)); return reject(JSON.stringify(result.err)); }
            let attributeValues = result.res;

            const numAttributeValues = attributeValues.length;
            let cursor = -1;
            let edges = [];

            attributeValues.forEach(async attributeValue => {
                let node = await getGraphQLAttributeValueById(attributeValue.id);
                edges.push({
                    cursor: "",
                    node
                });

                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numAttributeValues) {
                    resolve(edges);
                }
            }
        });
    })
}
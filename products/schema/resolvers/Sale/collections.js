const productQueries = require("../../../postgres/product-queries");
const { getGraphQLCollectionById } = require("../lib");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let saleId = parent.id;
        resolve(getCollection(saleId, args));
    });
}

function getCollection(saleId, args) {
    return new Promise(async(resolve, reject) => {
        try {
            let edges = await getAllCollections(saleId);
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

function getAllCollections(saleId) {
    return new Promise((resolve, reject) => {
        productQueries.getDiscountSaleCollection([saleId], "sale_id=$1", result => {
            if (result.err) { return reject(JSON.stringify(result.err)); }
            let collections = result.res;

            const numCollections = collections.length;
            let cursor = -1;
            let edges = [];

            collections.forEach(async collection => {
                let node = await getGraphQLCollectionById(collection.collection_id);
                edges.push({
                    cursor: "",
                    node
                });

                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numCollections) {
                    resolve(edges);
                }
            }
        });
    })
}
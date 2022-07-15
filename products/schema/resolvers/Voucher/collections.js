const productQueries = require("../../../postgres/product-queries");
const { getGraphQLCollectionById } = require("../lib");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let voucherId = parent.id;
        resolve(getCollection(voucherId, args));
    });
}

function getCollection(voucherId, args) {
    return new Promise(async(resolve, reject) => {
        try {
            let edges = await getAllCollections(voucherId);
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

function getAllCollections(voucherId) {
    return new Promise((resolve, reject) => {
        productQueries.getDiscountVoucherCollection([voucherId], "voucher_id=$1", result => {
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
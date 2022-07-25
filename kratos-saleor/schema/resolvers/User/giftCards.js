const {
    getGraphQLGiftCardById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        resolve(await giftCards(parent, args));
    });
}

function giftCards(parent, args) {
    return new Promise(async(resolve, reject) => {
        try {
            let edges = await getAllGiftCards(parent);
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

function getAllGiftCards(parent) {
    return new Promise((resolve, reject) => {
        productQueries.getGiftCard([parent.id], "created_by_id=$1", result => {
            if (result.err) { console.log(JSON.stringify(result.err)); return reject(JSON.stringify(result.err)); }
            let giftCards_ = result.res;

            const numGiftCards = giftCards_.length;
            let cursor = -1;
            let edges = [];

            giftCards_.forEach(async giftcard => {
                let node = await getGraphQLGiftCardById(giftcard.id);
                edges.push({
                    cursor: "",
                    node
                });

                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numGiftCards) {
                    resolve(edges);
                }
            }
        });
    })
}
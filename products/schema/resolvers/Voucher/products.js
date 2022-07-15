const productQueries = require("../../../postgres/product-queries");
const { getGraphQLProductById } = require("../lib");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let voucherId = parent.id;
        resolve(getProducts(voucherId, args));
    });
}

function getProducts(voucherId, args) {
    return new Promise(async(resolve, reject) => {
        try {
            let edges = await getAllProducts(voucherId);
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

function getAllProducts(voucherId) {
    return new Promise((resolve, reject) => {
        productQueries.getDiscountVoucherProduct([voucherId], "voucher_id=$1", result => {
            if (result.err) { return reject(JSON.stringify(result.err)); }
            let products = result.res;

            const numProducts = products.length;
            let cursor = -1;
            let edges = [];

            products.forEach(async product => {
                let node = await getGraphQLProductById(product.product_id);
                edges.push({
                    cursor: "",
                    node
                });

                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numProducts) {
                    resolve(edges);
                }
            }
        });
    })
}
const productQueries = require("../../../postgres/product-queries");
const { getGraphQLCategoryById } = require("../lib");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let voucherId = parent.id;
        resolve(getCategories(voucherId, args));
    });
}


function getCategories(voucherId, args) {
    return new Promise(async(resolve, reject) => {
        try {
            let edges = await getAllCategories(voucherId);
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

function getAllCategories(voucherId) {
    return new Promise((resolve, reject) => {
        productQueries.getDiscountVoucherCategories([voucherId], "voucher_id=$1", result => {
            if (result.err) { return reject(JSON.stringify(result.err)); }
            let categories = result.res;

            const numCategories = categories.length;
            let cursor = -1;
            let edges = [];

            categories.forEach(async category => {
                let node = await getGraphQLCategoryById(category.category_id);
                edges.push({
                    cursor: "",
                    node
                });

                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numCategories) {
                    resolve(edges);
                }
            }
        });
    })
}
const productQueries = require("../../../postgres/product-queries");
const { getGraphQLProductVariantById } = require("../lib");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let voucherId = parent.id;
        resolve(getVariants(voucherId, args));
    });
}

function getVariants(voucherId, args) {
    return new Promise(async(resolve, reject) => {
        try {
            let edges = await getAllVariants(voucherId);
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

function getAllVariants(voucherId) {
    return new Promise((resolve, reject) => {
        productQueries.getDiscountVoucherVariant([voucherId], "voucher_id=$1", result => {
            if (result.err) { return reject(JSON.stringify(result.err)); }
            let variants = result.res;

            const numVariants = variants.length;
            let cursor = -1;
            let edges = [];

            variants.forEach(async variant => {
                let node = await getGraphQLProductVariantById(variant.productvariant_id);
                edges.push({
                    cursor: "",
                    node
                });

                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numVariants) {
                    resolve(edges);
                }
            }
        });
    })
}
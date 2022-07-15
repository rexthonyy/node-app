const productQueries = require("../../../postgres/product-queries");
const { getGraphQLProductVariantById } = require("../lib");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let saleId = parent.id;
        resolve(getVariants(saleId, args));
    });
}

function getVariants(saleId, args) {
    return new Promise(async(resolve, reject) => {
        try {
            let edges = await getAllVariants(saleId);
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

function getAllVariants(saleId) {
    return new Promise((resolve, reject) => {
        productQueries.getDiscountSaleVariants([saleId], "sale_id=$1", result => {
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
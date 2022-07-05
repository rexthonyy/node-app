const {
    getGraphQLStockById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let productVariantId = parent.id;
        let address = args.address;
        let countryCode = args.countryCode;
        resolve(getStocks(productVariantId, address, countryCode));
    });
}

function getStocks(productVariantId, address, countryCode) {
    return new Promise((resolve, reject) => {
        productQueries.getStock([productVariantId], "product_variant_id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            let warehouseStocks = result.res;
            const numStocks = warehouseStocks.length;
            let cursor = -1;
            let graphqlStocks = [];

            warehouseStocks.forEach(async stock => {
                try {
                    graphqlStocks.push(await getGraphQLStockById(stock.id));
                } catch (err) {}
                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numStocks) {
                    resolve(graphqlStocks);
                }
            }
        });
    });
}
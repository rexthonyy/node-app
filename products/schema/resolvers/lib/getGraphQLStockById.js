const productQueries = require("../../../postgres/product-queries");
const getGraphQLWarehouseById = require("./getGraphQLWarehouseById");
const getGraphQLProductVariantById = require("./getGraphQLProductVariantById");

let getGraphQLStockById = (id) => {
    return new Promise((resolve, reject) => {
        productQueries.getStock([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                return reject("Stock not found");
            }

            let stock = result.res[0];
            let warehouse;
            let productVariant;

            try {
                warehouse = await getGraphQLWarehouseById(stock.warehouse_id);
            } catch (err) {
                warehouse = null;
            }
            try {
                productVariant = await getGraphQLProductVariantById(stock.product_variant_id);
            } catch (err) {
                productVariant = null;
            }

            let res = {
                id: stock.id,
                warehouse,
                productVariant,
                quantity: stock.quantity,
                quantityAllocated: stock.quantity_allocated,
                quantityReserved: null
            };

            resolve(res);
        });
    });
};

module.exports = getGraphQLStockById;
const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLProductVariantById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID", null, null, -1, null));

        let accessPermissions = ["MANAGE_PRODUCTS"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await productVariantStocksCreate(authUser, args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_PRODUCTS", "INVALID", null, null, -1, null));
        }
    });
}

function getGraphQLOutput(field, message, code, attributes, values, index, productVariant) {
    return {
        errors: [{
            field,
            message,
            code,
            attributes,
            values,
            index
        }],
        bulkStockErrors: [{
            field,
            message,
            code,
            attributes,
            values,
            index
        }],
        productVariant
    }
}

function productVariantStocksCreate(authUser, args) {
    return new Promise(async resolve => {
        let stocks = args.stocks;
        let variantId = args.variantId;
        const numStock = stocks.length;
        let cursor = -1;
        let errors = [];

        stocks.forEach(async stock => {
            try {
                await createProductVariantStock(variantId, stock);
            } catch (err) {
                errors.push(err);
                console.log(errors);
            }
            checkComplete();
        });

        checkComplete();

        async function checkComplete() {
            cursor++;
            if (cursor == numStock) {
                try {
                    let productVariant = await getGraphQLProductVariantById(variantId);
                    let res = {
                        errors,
                        bulkStockErrors: errors,
                        productVariant
                    };
                    console.log(res);
                    return resolve(res);
                } catch (err) {
                    resolve(getGraphQLOutput("productVariant", err, "GRAPHQL_ERROR", null, null, 0, null));
                }
            }
        }
    });
}

function createProductVariantStock(variantId, stock) {
    return new Promise((resolve, reject) => {
        productQueries.getWarehouse([stock.warehouse], "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("stock.warehouse", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, 0, null).errors[0]);
            if (result.res.length == 0) return reject(getGraphQLOutput("warehouse", "Warehouse not found", "GRAPHQL_ERROR", null, null, 0, null).errors[0]);
            productQueries.createWarehouseStock([stock.quantity, variantId, stock.warehouse, 0], result => {
                if (result.err) return reject(getGraphQLOutput("stock.warehouse", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, 0, null).errors[0]);
                if (result.res.length == 0) return reject(getGraphQLOutput("warehouse", "Warehouse stock not created", "GRAPHQL_ERROR", null, null, 0, null).errors[0]);
                resolve();
            });
        });
    });
}
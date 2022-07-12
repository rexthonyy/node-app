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
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID", null, null, null));

        let accessPermissions = ["MANAGE_PRODUCTS"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await productVariantStocksCreate(authUser, args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_PRODUCTS", "INVALID", null, null, null));
        }
    });
}

function getGraphQLOutput(field, message, code, attributes, values, productVariant) {
    return {
        errors: [{
            field,
            message,
            code,
            attributes,
            values
        }],
        productErrors: [{
            field,
            message,
            code,
            attributes,
            values
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
                errors.concat(err);
            }
            checkComplete();
        });

        checkComplete();

        async function checkComplete() {
            cursor++;
            if (cursor == numStock) {
                try {
                    let productVariant = await getGraphQLProductVariantById(variantId);
                    return resolve({
                        errors,
                        productErrors: errors,
                        productVariant
                    });
                } catch (err) {
                    resolve(getGraphQLOutput("productVariant", err, "GRAPHQL_ERROR", null, null, null));
                }
            }
        }
    });
}

function createProductVariantStock(variantId, stock) {
    return new Promise((resolve, reject) => {
        productQueries.getWarehouse([stock.warehouse], "id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Warehouse not found");
            productQueries.createWarehouseStock([stock.quantity, variantId, stock.warehouse, 0], result => {
                if (result.err) return reject(JSON.stringify(result.err));
                if (result.res.length == 0) return reject("Warehouse stock not created");
                resolve();
            });
        });
    });
}
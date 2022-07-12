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
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID", null));

        let accessPermissions = ["MANAGE_PRODUCTS"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await productVariantStocksDelete(authUser, args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_PRODUCTS", "INVALID", null));
        }
    });
}

function getGraphQLOutput(field, message, code, productVariant) {
    return {
        errors: [{
            field,
            message,
            code
        }],
        stockErrors: [{
            field,
            message,
            code
        }],
        productVariant
    }
}

function productVariantStocksDelete(authUser, args) {
    return new Promise(async resolve => {
        let variantId = args.variantId;
        let warehouseIds = args.warehouseIds;
        const numWarehouseIds = warehouseIds.length;
        let cursor = -1;

        warehouseIds.forEach(async warehouseId => {
            try {
                await deleteProductVariantStock(variantId, warehouseId);
            } catch (err) {
                errors.push(err);
            }
            checkComplete();
        });

        checkComplete();

        function checkComplete() {
            cursor++;
            if (cursor == numWarehouseIds) {
                try {
                    let productVariant = await getGraphQLProductVariantById(variantId);
                    let res = {
                        errors,
                        stockErrors: errors,
                        productVariant
                    };
                    return resolve(res);
                } catch (err) {
                    resolve(getGraphQLOutput("productVariant", err, "GRAPHQL_ERROR", null));
                }
            }
        }
    });
}

function deleteProductVariantStock(variantId, warehouseId) {
    return new Promise((resolve, reject) => {
        productQueries.deleteStock([variantId, warehouseId], "product_variant_id=$1 AND warehouse_id=$2", result => {
            if (result.err) return reject(getGraphQLOutput("warehousestock", JSON.stringify(result.err), "GRAPHQL_ERROR", null).errors[0]);
            resolve();
        });
    });
}
const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLWarehouseById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID"));

        let accessPermissions = ["MANAGE_PRODUCTS"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await deleteWarehouse(args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_PRODUCTS", "INVALID"));
        }
    });
}

function getGraphQLOutput(field, message, code, warehouse) {
    return {
        errors: [{
            field,
            message,
            code
        }],
        warehouseErrors: [{
            field,
            message,
            code
        }],
        warehouse
    }
}

function deleteWarehouse(args) {
    return new Promise(resolve => {
        let warehouseId = args.id;
        productQueries.getWarehouse([warehouseId], "id=$1", async result => {
            if (result.err) return resolve(getGraphQLOutput("getWarehouse", JSON.stringify(result.err), "GRAPHQL_ERROR"));
            if (result.res.length == 0) return resolve(getGraphQLOutput("getWarehouse", `Warehouse not found: ${warehouseId}`, "NOT_FOUND"));
            let warehouse;
            let errors = [];

            try {
                warehouse = await getGraphQLWarehouseById(warehouseId);
            } catch (err) {
                errors.push(getGraphQLOutput("getGraphQLWarehouseById", err, "NOT_FOUND").errors[0]);
                warehouse = null;
            }

            try {
                await deleteWarehouseStock(warehouseId);
            } catch (err) {
                errors = errors.concat(err);
            }

            try {
                await deleteWarehouseShippingZones(warehouseId);
            } catch (err) {
                errors = errors.concat(err);
            }

            try {
                await execDeleteWarehouse(warehouseId);
            } catch (err) {
                errors = errors.concat(err);
            }

            resolve({
                errors,
                warehouseErrors: errors,
                warehouse
            });
        });
    });
}

function deleteWarehouseStock(warehouseId) {
    return new Promise((resolve, reject) => {
        productQueries.deleteStock([warehouseId], "warehouse_id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("deleteStock", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            let warehouseStock = result.res;
            const numWarehouseStock = warehouseStock.length;
            let cursor = -1;
            let errors = [];

            warehouseStock.forEach(async stock => {
                try {
                    await deleteOrderFulfillmentLine(stock.id);
                } catch (err) {
                    errors = errors.concat(err);
                }
                try {
                    await deleteWarehouseReservation(stock.id);
                } catch (err) {
                    errors = errors.concat(err);
                }
                try {
                    await deleteWarehouseAllocation(stock.id);
                } catch (err) {
                    errors = errors.concat(err);
                }
                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numWarehouseStock) {
                    if (errors.length > 0) return reject(errors);
                    resolve();
                }
            }
        });
    });
}

function deleteOrderFulfillmentLine(stockId) {
    return new Promise((resolve, reject) => {
        productQueries.deleteOrderFulfillmentLine([stockId], "stock_id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("deleteOrderFulfillmentLine", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            resolve();
        });
    });
}

function deleteWarehouseReservation(stockId) {
    return new Promise((resolve, reject) => {
        productQueries.deleteWarehouseReservation([stockId], "stock_id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("deleteWarehouseReservation", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            resolve();
        });
    });
}

function deleteWarehouseAllocation(stockId) {
    return new Promise((resolve, reject) => {
        productQueries.deleteWarehouseAllocation([stockId], "stock_id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("deleteWarehouseAllocation", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            resolve();
        });
    });
}

function deleteWarehouseShippingZones(warehouseId) {
    return new Promise((resolve, reject) => {
        productQueries.deleteWarehouseShippingZones([warehouseId], "warehouse_id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("deleteWarehouseShippingZones", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            resolve();
        });
    });
}

function execDeleteWarehouse(warehouseId) {
    return new Promise((resolve, reject) => {
        productQueries.deleteWarehouse([warehouseId], "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("deleteWarehouse", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            resolve();
        });
    });
}
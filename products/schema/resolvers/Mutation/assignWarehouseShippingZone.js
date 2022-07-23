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
            resolve(await assignWarehouseShippingZone(args));
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

function assignWarehouseShippingZone(args) {
    return new Promise(resolve => {
        let warehouseId = args.id;
        productQueries.getWarehouse([warehouseId], "id=$1", async result => {
            if (result.err) return resolve(getGraphQLOutput("getWarehouse", JSON.stringify(result.err), "GRAPHQL_ERROR"));
            if (result.res.length == 0) return resolve(getGraphQLOutput("getWarehouse", `Warehouse not found: ${warehouseId}`, "NOT_FOUND"));

            let shippingZoneIds = args.shippingZoneIds;
            const numShippingZoneIds = shippingZoneIds.length;
            let cursor = -1;
            let errors = [];

            shippingZoneIds.forEach(async shippingZoneId => {
                try {
                    await resolveWarehouseShippingZone(warehouseId, shippingZoneId);
                } catch (err) {
                    errors = errors.concat(err);
                }
                checkComplete();
            });

            checkComplete();
            async function checkComplete() {
                cursor++;
                if (cursor == numShippingZoneIds) {
                    let warehouse;
                    try {
                        warehouse = await getGraphQLWarehouseById(warehouseId);
                    } catch (err) {
                        warehouse = null;
                        errors.push(getGraphQLOutput("getGraphQLWarehouseById", err, "NOT_FOUND").errors[0]);
                    }

                    resolve({
                        errors,
                        warehouseErrors: errors,
                        warehouse
                    });
                }
            }
        });
    });
}

function resolveWarehouseShippingZone(warehouseId, shippingZoneId) {
    return new Promise((resolve, reject) => {
        productQueries.getWarehouseShippingZones([warehouseId, shippingZoneId], "warehouse_id=$1 AND shippingzone_id=$2", result => {
            if (result.err) return reject(getGraphQLOutput("getWarehouseShippingZones", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length > 0) return reject(getGraphQLOutput("getWarehouseShippingZones", `Warehouse shipping zone already defined : ${shippingZoneId}`, "ALREADY_EXISTS").errors);
            productQueries.createWarehouseShippingZone([warehouseId, shippingZoneId], result => {
                if (result.err) return reject(getGraphQLOutput("createWarehouseShippingZone", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
                if (result.res.length == 0) return reject(getGraphQLOutput("createWarehouseShippingZone", `Warehouse shipping zone not created : ${shippingZoneId}`, "GRAPHQL_ERROR").errors);
                resolve();
            });
        });
    });
}
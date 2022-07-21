const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLShippingZoneById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID"));

        let accessPermissions = ["MANAGE_SHIPPING"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await shippingZoneUpdate(args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_SHIPPING", "INVALID"));
        }
    });
}

function getGraphQLOutput(field, message, code, warehouses, channels, shippingZone) {
    return {
        errors: [{
            field,
            message,
            code,
            warehouses,
            channels
        }],
        shippingErrors: [{
            field,
            message,
            code,
            warehouses,
            channels
        }],
        shippingZone
    }
}

function shippingZoneUpdate(args) {
    return new Promise(async resolve => {
        productQueries.getShippingZone([args.id], "id=$1", result => {
            if (result.err) return resolve(getGraphQLOutput("getShippingZone", JSON.stringify(result.err), "GRAPHQL_ERROR"));
            if (result.res.length == 0) return resolve(getGraphQLOutput("getShippingZone", "Shipping zone not found", "NOT_FOUND"));

            let errors = [];

            try {
                await updateShippingZone(args);
            } catch (err) {
                errors.concat(err);
            }

            try {
                await addWarehouses(args);
            } catch (err) {
                errors.concat(err);
            }

            try {
                await addChannels(args);
            } catch (err) {
                errors.concat(err);
            }

            try {
                await removeWarehouses(args);
            } catch (err) {
                errors.concat(err);
            }

            try {
                await removeChannels(args);
            } catch (err) {
                errors.concat(err);
            }

            try {
                let shippingZone = await getGraphQLShippingZoneById(args.id);
                resolve({
                    errors,
                    shippingErrors: errors,
                    shippingZone
                });
            } catch (err) {
                resolve(getGraphQLOutput("getGraphQLShippingZoneById", err, "GRAPHQL_ERROR"));
            }
        });
    });
}

function updateShippingZone(args) {
    return new Promise((resolve, reject) => {
        let { values, set, whereClause } = getShippingZoneUpdateInput(args);
        productQueries.updateShippingZone(values, set, whereClause, result => {
            if (result.err) return reject(getGraphQLOutput("updateShippingZone", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length) return reject(getGraphQLOutput("updateShippingZone", "Failed to update shipping zone", "GRAPHQL_ERROR").errors);
            resolve();
        });
    });
}

function getShippingZoneUpdateInput({ id, input }) {
    let values = [id];
    let whereClause = "id=$1";
    let set = "";
    let cursor = 1;

    if (input.name != null) {
        values.push(input.name);
        set += set ? ", " : "";
        set += `name=$${++cursor}`;
    }
    if (input.description != null) {
        values.push(input.description);
        set += set ? ", " : "";
        set += `description=$${++cursor}`;
    }
    if (input.default != null) {
        values.push(input.default);
        set += set ? ", " : "";
        set += `"default"=$${++cursor}`;
    }
    if (input.countries != null) {
        let countries_ = "";
        for (let i = 0; i < input.countries.length; i++) {
            if (i > 0) {
                countries_ += ",";
            }
            countries_ += input.countries[i];
        }
        values.push(countries_);
        set += set ? ", " : "";
        set += `countries=$${++cursor}`;
    }
    return { values, set, whereClause };
}

function addWarehouses(args) {
    return new Promise((resolve, reject) => {
        if (!args.input.addWarehouses) return resolve();
        let warehouseIds = args.input.addWarehouses;
        const numWarehouses = warehouseIds.length;
        let cursor = -1;
        let errors = [];

        warehouseIds.forEach(async warehouseId => {
            try {
                await addWarehouseById(warehouseId, args);
            } catch (err) {
                errors.concat(err);
            }
            checkComplete();
        });

        checkComplete();

        function checkComplete() {
            cursor++;
            if (cursor == numWarehouses) {
                if (errors.length > 0) return reject(errors);
                resolve();
            }
        }
    });
}

function addWarehouseById(warehouseId, args) {
    return new Promise(resolve => {
        productQueries.getWarehouseShippingZones([warehouseId, args.id], "warehouse_id=$1 AND shippingzone_id=$2", result => {
            if (result.err) return reject(getGraphQLOutput("getWarehouseShippingZones", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length > 0) return reject(getGraphQLOutput("getWarehouseShippingZones", "Warehouse shipping zone already exists", "ALREADY_EXISTS").errors);
            productQueries.createWarehouseShippingZone([warehouseId, args.id], result => {
                if (result.err) return reject(getGraphQLOutput("createWarehouseShippingZone", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
                if (result.res.length == 0) return reject(getGraphQLOutput("createWarehouseShippingZone", "Warehouse shipping zone not created", "GRAPHQL_ERROR").errors);
                resolve();
            });
        });
    });
}

function addChannels(args) {
    return new Promise((resolve, reject) => {
        if (!args.input.addChannels) return resolve();
        let channelIds = args.input.addChannels;
        const numChannels = channelIds.length;
        let cursor = -1;
        let errors = [];

        channelIds.forEach(async channelId => {
            try {
                await addChannelById(channelId, args);
            } catch (err) {
                errors.concat(err);
            }
            checkComplete();
        });

        checkComplete();

        function checkComplete() {
            cursor++;
            if (cursor == numChannels) {
                if (errors.length > 0) return reject(errors);
                resolve();
            }
        }
    });
}

function addChannelById(channelId, args) {
    return new Promise(resolve => {
        productQueries.getShippingZoneChannel([channelId, args.id], "channel_id=$1 AND shippingzone_id=$2", result => {
            if (result.err) return reject(getGraphQLOutput("getShippingZoneChannel", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length > 0) return reject(getGraphQLOutput("getShippingZoneChannel", "Shipping zone channel already exists", "ALREADY_EXISTS").errors);
            productQueries.createShippingZoneChannel([args.id, channelId], result => {
                if (result.err) return reject(getGraphQLOutput("createShippingZoneChannel", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
                if (result.res.length == 0) return reject(getGraphQLOutput("createShippingZoneChannel", "Shipping zone channel not created", "GRAPHQL_ERROR").errors);
                resolve();
            });
        });
    });
}


function removeWarehouses(args) {
    return new Promise((resolve, reject) => {
        if (!args.input.removeWarehouses) return resolve();
        let warehouseIds = args.input.removeWarehouses;
        const numWarehouses = warehouseIds.length;
        let cursor = -1;
        let errors = [];

        warehouseIds.forEach(async warehouseId => {
            try {
                await removeWarehouseById(warehouseId, args);
            } catch (err) {
                errors.concat(err);
            }
            checkComplete();
        });

        checkComplete();

        function checkComplete() {
            cursor++;
            if (cursor == numWarehouses) {
                if (errors.length > 0) return reject(errors);
                resolve();
            }
        }
    });
}

function removeWarehouseById(warehouseId, args) {
    return new Promise(resolve => {
        productQueries.deleteShippingZoneWarehouse([warehouseId, args.id], "warehouse_id=$1 AND shippingzone_id=$2", result => {
            if (result.err) return reject(getGraphQLOutput("deleteShippingZoneWarehouse", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            resolve();
        });
    });
}

function removeChannels(args) {
    return new Promise((resolve, reject) => {
        if (!args.input.removeChannels) return resolve();
        let channelIds = args.input.removeChannels;
        const numChannels = channelIds.length;
        let cursor = -1;
        let errors = [];

        channelIds.forEach(async channelId => {
            try {
                await removeChannelById(channelId, args);
            } catch (err) {
                errors.concat(err);
            }
            checkComplete();
        });

        checkComplete();

        function checkComplete() {
            cursor++;
            if (cursor == numChannels) {
                if (errors.length > 0) return reject(errors);
                resolve();
            }
        }
    });
}

function removeChannelById(channelId, args) {
    return new Promise(resolve => {
        productQueries.deleteShippingZoneChannels([channelId, args.id], "channel_id=$1 AND shippingzone_id=$2", result => {
            if (result.err) return reject(getGraphQLOutput("deleteShippingZoneChannels", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            resolve();
        });
    });
}
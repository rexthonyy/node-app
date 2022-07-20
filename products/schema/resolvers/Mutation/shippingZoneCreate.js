const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLShippingMethodTypeById,
    getGraphQLShippingZoneById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");
const kratosQueries = require("../../../postgres/kratos-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID", null, null, null));

        let accessPermissions = ["MANAGE_SHIPPING"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await shippingZoneCreate(authUser, args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_SHIPPING", "INVALID", null, null, null));
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

function shippingZoneCreate(authUser, args) {
    return new Promise(async resolve => {
        let errors = [];
        let shippingZone;
        let shippingZone_;

        try {
            shippingZone_ = await createShippingZone(args);
        } catch (err) {
            return resolve({
                errors: err,
                shippingErrors: err,
                shippingZone: null
            });
        }

        if (args.input.addWarehouses) {
            try {
                await addWarehouses(args, shippingZone_);
            } catch (err) {
                errors.concat(err);
            }
        }

        if (args.input.addChannels) {
            try {
                await addChannels(args, shippingZone_);
            } catch (err) {
                errors.concat(err);
            }
        }

        try {
            shippingZone = await getGraphQLShippingZoneById(shippingZone_.id);
        } catch (err) {
            errors.concat(getGraphQLOutput("getGraphQLShippingZoneById", err, "GRAPHQL_ERROR", null, null, null).errors);
            shippingZone = null;
        }

        return resolve({
            shippingZone,
            errors,
            shippingErrors: errors
        });
    });
}

function createShippingZone(args) {
    return new Promise(async(resolve, reject) => {
        let values = getShippingZoneInputValues(args);
        console.log(values);
        productQueries.createShippingZone(values, result => {
            if (result.err) return reject(getGraphQLOutput("createShippingZone", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null).errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("createShippingZone", "Shipping zone not created", "GRAPHQL_ERROR", null, null, null).errors);
            let shippingZone = result.res[0];
            resolve(shippingZone);
        });
    });
}

function getShippingZoneInputValues(args) {
    let name = args.input.name || "";
    let description = args.input.description || "";
    let countries = args.input.countries;
    let default_ = args.input.default || false;
    let countries_ = "";
    if (countries) {
        for (let i = 0; i < countries.length; i++) {
            if (i > 0) {
                countries_ += ",";
            }
            countries_ += countries[i];
        }
    }
    return [
        name,
        countries_,
        default_,
        JSON.stringify({}),
        JSON.stringify({}),
        description
    ];
}

function addWarehouses(args, shippingZone_) {
    return new Promise((resolve, reject) => {
        let warehouseIds = args.input.addWarehouses;
        const numWarehouses = warehouseIds.length;
        let cursor = -1;
        let errors = [];

        warehouseIds.forEach(warehouseId => {
            productQueries.getWarehouse([warehouseId], "id=$1", async result => {
                if (result.err) {
                    errors.push(getGraphQLOutput("getWarehouse", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null).errors[0]);
                } else if (result.res.length == 0) {
                    errors.push(getGraphQLOutput("getWarehouse", `Warehouse not found:${warehouseId}`, "NOT_FOUND", null, null, null).errors[0]);
                } else {
                    let warehouse_ = result.res[0];
                    try {
                        await createWarehouseShippingZone(warehouse_, shippingZone_);
                    } catch (err) {
                        errors.push(err);
                    }
                }
                checkComplete();
            });
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

function createWarehouseShippingZone(warehouse_, shippingZone_) {
    return new Promise((resolve, reject) => {
        productQueries.getWarehouseShippingZones([warehouse_.id, shippingZone_.id], "warehouse_id=$1 AND shippingzone_id=$2", result => {
            if (result.err) return reject(getGraphQLOutput("getWarehouseShippingZones", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null).errors[0]);
            if (result.res.length > 0) return reject(getGraphQLOutput("getWarehouseShippingZones", "Warehouse shipping zone already defined", "ALREADY_EXISTS", null, null, null).errors[0]);
            productQueries.createWarehouseShippingZone([warehouse_.id, shippingZone_.id], result => {
                if (result.err) return reject(getGraphQLOutput("createWarehouseShippingZone", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null).errors[0]);
                if (result.res.length == 0) return reject(getGraphQLOutput("createWarehouseShippingZone", "Warehouse shipping zone not created", "GRAPHQL_ERROR", null, null, null).errors[0]);
                resolve();
            });
        });
    });
}

function addChannels(args, shippingZone_) {
    return new Promise((resolve, reject) => {
        let channelIds = args.input.addChannels;
        const numChannels = channelIds.length;
        let cursor = -1;
        let errors = [];

        channelIds.forEach(channelId => {
            kratosQueries.getChannel([channelId], "id=$1", async result => {
                if (result.err) {
                    errors.push(getGraphQLOutput("getChannel", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null).errors[0]);
                } else if (result.res.length == 0) {
                    errors.push(getGraphQLOutput("getChannel", `Channel not found:${channelId}`, "NOT_FOUND", null, null, null).errors[0]);
                } else {
                    let channel_ = result.res[0];
                    try {
                        await createShippingZoneChannel(channel_, shippingZone_);
                    } catch (err) {
                        errors.push(err);
                    }
                }
                checkComplete();
            });
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

function createShippingZoneChannel(channel_, shippingZone_) {
    return new Promise((resolve, reject) => {
        productQueries.getShippingZoneChannel([channel_.id, shippingZone_.id], "channel_id=$1 AND shippingzone_id=$2", result => {
            if (result.err) return reject(getGraphQLOutput("getShippingZoneChannel", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null).errors[0]);
            if (result.res.length > 0) return reject(getGraphQLOutput("getShippingZoneChannel", "Channel shipping zone already defined", "ALREADY_EXISTS", null, null, null).errors[0]);
            productQueries.createShippingZoneChannel([shippingZone_.id, channel_.id], result => {
                if (result.err) return reject(getGraphQLOutput("createShippingZoneChannel", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null).errors[0]);
                if (result.res.length == 0) return reject(getGraphQLOutput("createShippingZoneChannel", "Channel shipping zone not created", "GRAPHQL_ERROR", null, null, null).errors[0]);
                resolve();
            });
        });
    });
}
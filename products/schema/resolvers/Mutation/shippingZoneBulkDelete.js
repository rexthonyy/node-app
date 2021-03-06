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
            resolve(await shippingZoneBulkDelete(args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_SHIPPING", "INVALID"));
        }
    });
}

function getGraphQLOutput(field, message, code, warehouses, channels, count = 0) {
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
        count
    }
}

function shippingZoneBulkDelete({ ids }) {
    return new Promise(resolve => {
        const numIds = ids.length;
        let cursor = -1;
        let errors = [];

        ids.forEach(async id => {
            try {
                await shippingZoneDelete(id);
            } catch (err) {
                errors = errors.concat(err);
            }
            checkComplete();
        });
        checkComplete();

        function checkComplete() {
            cursor++;
            if (cursor == numIds) {
                resolve({
                    errors,
                    shippingErrors: errors,
                    count: numIds
                });
            }
        }
    });
}

function shippingZoneDelete(shippingZoneId) {
    return new Promise((resolve, reject) => {
        productQueries.getShippingZone([shippingZoneId], "id=$1", async result => {
            if (result.err) return reject(getGraphQLOutput("getShippingZone", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("getShippingZone", `Cannot resolve id:${shippingZoneId}`, "NOT_FOUND").errors);
            let shippingZone_ = result.res[0];

            let errors = [];

            try {
                await deleteShippingZoneWarehouse(shippingZone_.id);
            } catch (err) {
                errors.push(err);
            }

            try {
                await deleteShippingMethod(shippingZone_.id);
            } catch (err) {
                errors.concat(err);
            }

            try {
                await deleteShippingZoneChannels(shippingZone_.id);
            } catch (err) {
                errors.push(err);
            }

            try {
                await deleteShippingZone(shippingZone_.id);
            } catch (err) {
                errors.push(err);
            }

            if (errors.length > 0) return reject(errors);
            resolve();
        });
    });
}

function deleteShippingZoneWarehouse(shippingZoneId) {
    return new Promise((resolve, reject) => {
        productQueries.deleteShippingZoneWarehouse([shippingZoneId], "shippingzone_id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("deleteShippingZoneWarehouse", JSON.stringify(result.err), "GRAPHQL_ERROR").errors[0]);
            resolve();
        });
    });
}

function deleteShippingMethod(shippingZoneId) {
    return new Promise((resolve, reject) => {
        productQueries.getShippingMethod([shippingZoneId], "shipping_zone_id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("getShippingMethod", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            let shippingMethods_ = result.res;
            const numShippingMethods = shippingMethods_.length;
            let cursor = -1;
            let errors = [];

            shippingMethods_.forEach(async _shippingMethod => {
                try {
                    await deleteShippingMethodPostalCodeRule(_shippingMethod.id);
                } catch (err) {
                    errors.push(err);
                }
                try {
                    await deleteShippingMethodTranslation(_shippingMethod.id);
                } catch (err) {
                    errors.push(err);
                }
                try {
                    await deleteShippingMethodChannelListing(_shippingMethod.id);
                } catch (err) {
                    errors.push(err);
                }
                try {
                    await deleteShippingMethodExcludedProducts(_shippingMethod.id);
                } catch (err) {
                    errors.push(err);
                }
                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numShippingMethods) {
                    if (errors.length > 0) return reject(errors);
                    resolve();
                }
            }
        });
    });
}

function deleteShippingMethodPostalCodeRule(shippingMethodId) {
    return new Promise(async(resolve, reject) => {
        productQueries.deleteShippingMethodPostalCodeRule([shippingMethodId], "shipping_method_id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("deleteShippingMethodPostalCodeRule", JSON.stringify(result.err), "GRAPHQL_ERROR").errors[0]);
            resolve();
        });
    });
}

function deleteShippingMethodTranslation(shippingMethodId) {
    return new Promise(async(resolve, reject) => {
        productQueries.deleteShippingMethodTranslation([shippingMethodId], "shipping_method_id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("deleteShippingMethodTranslation", JSON.stringify(result.err), "GRAPHQL_ERROR").errors[0]);
            resolve();
        });
    });
}

function deleteShippingMethodChannelListing(shippingMethodId) {
    return new Promise(async(resolve, reject) => {
        productQueries.deleteShippingMethodChannelListing([shippingMethodId], "shipping_method_id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("deleteShippingMethodChannelListing", JSON.stringify(result.err), "GRAPHQL_ERROR").errors[0]);
            resolve();
        });
    });
}

function deleteShippingMethodExcludedProducts(shippingMethodId) {
    return new Promise(async(resolve, reject) => {
        productQueries.deleteShippingMethodExcludedProducts([shippingMethodId], "shippingmethod_id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("deleteShippingMethodExcludedProducts", JSON.stringify(result.err), "GRAPHQL_ERROR").errors[0]);
            resolve();
        });
    });
}

function deleteShippingZoneChannels(shippingZoneId) {
    return new Promise(async(resolve, reject) => {
        productQueries.deleteShippingZoneChannels([shippingZoneId], "shippingzone_id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("deleteShippingZoneChannels", JSON.stringify(result.err), "GRAPHQL_ERROR").errors[0]);
            resolve();
        });
    });
}

function deleteShippingZone(shippingZoneId) {
    return new Promise(async(resolve, reject) => {
        productQueries.deleteShippingZone([shippingZoneId], "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("deleteShippingZone", JSON.stringify(result.err), "GRAPHQL_ERROR").errors[0]);
            resolve();
        });
    });
}
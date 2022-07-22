const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLShippingZoneById,
    getGraphQLShippingMethodTypeById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID"));

        let accessPermissions = ["MANAGE_SHIPPING"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await shippingPriceUpdate(args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_SHIPPING", "INVALID"));
        }
    });
}

function getGraphQLOutput(field, message, code, warehouses, channels, shippingZone, shippingMethod) {
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
        shippingZone,
        shippingMethod
    }
}

function shippingPriceUpdate(args) {
    return new Promise(async resolve => {
        try {
            await getShippingMethod(args.id);
        } catch (err) {
            return resolve({
                errors: err,
                shippingErrors: err,
                shippingMethod: null,
                shippingZone: null
            });
        }

        let shippingMethod;
        let shippingZone;
        let shippingMethod_;
        let errors = [];

        try {
            await updateShippingMethod(args);
        } catch (err) {
            console.log(err);
            errors = errors.concat(err);
        }

        try {
            await addPostalCodeRules(args);
        } catch (err) {
            errors = errors.concat(err);
        }

        try {
            await deletePostalCodeRules(args);
        } catch (err) {
            errors = errors.concat(err);
        }

        try {
            shippingMethod_ = await getShippingMethod(args.id);
        } catch (err) {
            errors = errors.concat(err);
        }

        try {
            shippingMethod = getGraphQLShippingMethodTypeById(shippingMethod_.id);
        } catch (err) {
            shippingMethod = null;
            errors.push(getGraphQLOutput("getGraphQLShippingMethodTypeById", err, "NOT_FOUND").errors[0]);
        }

        try {
            shippingZone = getGraphQLShippingZoneById(shippingMethod.shipping_zone_id);
        } catch (err) {
            shippingZone = null;
            errors.push(getGraphQLOutput("getGraphQLShippingZoneById", err, "NOT_FOUND").errors[0]);
        }

        resolve({
            errors,
            shippingErrors: errors,
            shippingZone,
            shippingMethod
        });
    });
}

function getShippingMethod(id) {
    return new Promise((resolve, reject) => {
        productQueries.getShippingMethod([id], "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("getShippingMethod", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("getShippingMethod", "Shipping price not found", "NOT_FOUND").errors);
            resolve(result.res[0]);
        });
    })
}

function getShippingZone(id) {
    return new Promise((resolve, reject) => {
        productQueries.getShippingZone([id], "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("getShippingZone", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("getShippingZone", "Shipping zone not found", "NOT_FOUND").errors);
            resolve(result.res[0]);
        });
    })
}

function updateShippingMethod(args) {
    return new Promise(async(resolve, reject) => {
        console.log("updateShippingMethod");
        return reject(getGraphQLOutput("getShippingZone", "JSON.stringify(result.err)", "GRAPHQL_ERROR").errors)
        if (!isUpdateShippingMethod(args)) return resolve();
        if (args.input.shippingZone) {
            try {
                await getShippingZone(args.input.shippingZone);
            } catch (err) {
                return reject(err);
            }
        }

        let { values, set, whereClause } = getShippingMethodUpdateInput(args);
        productQueries.updateShippingMethod(values, set, whereClause, result => {
            if (result.err) return reject(getGraphQLOutput("updateShippingMethod", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("updateShippingMethod", "Failed to update shipping method", "GRAPHQL_ERROR").errors);
            resolve();
        });
    });
}

function isUpdateShippingMethod(args) {
    return args.input.name || args.input.description || args.input.minimumOrderWeight || args.input.maximumOrderWeight || args.input.minimumDeliveryDays || args.input.type || args.input.shippingZone;
}

function getShippingMethodUpdateInput({ id, input }) {
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
    if (input.minimumOrderWeight != null) {
        values.push(input.minimumOrderWeight);
        set += set ? ", " : "";
        set += `minimum_order_weight=$${++cursor}`;
    }
    if (input.maximumOrderWeight != null) {
        values.push(input.maximumOrderWeight);
        set += set ? ", " : "";
        set += `maximum_order_weight=$${++cursor}`;
    }
    if (input.maximumDeliveryDays != null) {
        values.push(input.maximumDeliveryDays);
        set += set ? ", " : "";
        set += `maximum_delivery_days=$${++cursor}`;
    }
    if (input.minimumDeliveryDays != null) {
        values.push(input.minimumDeliveryDays);
        set += set ? ", " : "";
        set += `minimum_delivery_days=$${++cursor}`;
    }
    if (input.type != null) {
        values.push(input.type);
        set += set ? ", " : "";
        set += `type=$${++cursor}`;
    }
    if (input.shippingZone != null) {
        values.push(input.shippingZone);
        set += set ? ", " : "";
        set += `shipping_zone_id=$${++cursor}`;
    }

    return { values, set, whereClause };
}

function addPostalCodeRules(args) {
    return new Promise((resolve, reject) => {
        if (!args.input.addPostalCodeRules) return resolve();
        let rules = args.input.addPostalCodeRules;
        const numRules = rules.length;
        let cursor = -1;
        let errors = [];

        rules.forEach(rule => {
            let start = rule.start;
            let end = rule.end;
            let inclusionType = args.input.inclusionType || "INCLUDE";
            let shippingMethodId = args.id;

            let values = [
                start,
                end,
                shippingMethodId,
                inclusionType
            ];
            productQueries.createShippingMethodPostalCodeRule(values, result => {
                if (result.err) {
                    errors.push(getGraphQLOutput("createShippingMethodPostalCodeRule", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
                } else if (result.res.length == 0) {
                    errors.push(getGraphQLOutput("createShippingMethodPostalCodeRule", "Shipping method postal code rule not created", "GRAPHQL_ERROR").errors);
                }
                checkComplete();
            });
        });

        checkComplete();

        function checkComplete() {
            cursor++;
            if (cursor == numRules) {
                if (errors.length > 0) return reject(errors);
                resolve();
            }
        }
    });
}

function deletePostalCodeRules(args) {
    return new Promise((resolve, reject) => {
        if (!args.input.deletePostalCodeRules) return resolve();
        let ruleIds = args.input.deletePostalCodeRules;
        const numRules = ruleIds.length;
        let cursor = -1;
        let errors = [];

        ruleIds.forEach(id => {
            productQueries.deleteShippingMethodPostalCodeRule([id], "id=$1", result => {
                if (result.err) {
                    errors.push(getGraphQLOutput("deleteShippingMethodPostalCodeRule", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
                }
                checkComplete();
            });
        });

        checkComplete();

        function checkComplete() {
            cursor++;
            if (cursor == numRules) {
                if (errors.length > 0) return reject(errors);
                resolve();
            }
        }
    });
}
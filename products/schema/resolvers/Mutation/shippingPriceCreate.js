const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLShippingMethodTypeById,
    getGraphQLShippingZoneById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID", null, null, null));

        let accessPermissions = ["MANAGE_SHIPPING"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await shippingPriceCreate(authUser, args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_SHIPPING", "INVALID", null, null, null));
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

function shippingPriceCreate(authUser, args) {
    return new Promise(async resolve => {
        let errors = [];
        let shippingZone;
        let shippingMethod;
        let shippingMethod_;

        try {
            shippingMethod_ = await createShippingMethod(args);
        } catch (err) {
            return resolve({
                errors: err,
                shippingErrors: err,
                shippingZone: null,
                shippingMethod: null
            });
        }

        try {
            await createShippingMethodPostalCodeRule(args, shippingMethod_);
        } catch (err) {
            errors.concat(err);
        }

        try {
            shippingMethod = await getGraphQLShippingMethodTypeById(shippingMethod_.id);
        } catch (err) {
            errors.concat(getGraphQLOutput("getGraphQLShippingMethodTypeById", err, "GRAPHQL_ERROR", null, null, null).errors);
            shippingMethod = null;
        }

        if (shippingMethod_.shipping_zone_id) {
            try {
                shippingZone = await getGraphQLShippingZoneById(shippingMethod_.shipping_zone_id);
            } catch (err) {
                errors.concat(getGraphQLOutput("getGraphQLShippingZoneById", err, "GRAPHQL_ERROR", null, null, null).errors);
                shippingZone = null;
            }
        } else {
            shippingZone = null;
        }

        return resolve({
            shippingZone,
            shippingMethod,
            errors,
            shippingErrors: errors
        });
    });
}

function createShippingMethod(args) {
    return new Promise(async(resolve, reject) => {
        await resolveShippingZoneAvailable(args);

        if (args.input.minimumOrderWeight && args.input.maximumOrderWeight) {
            if (args.input.minimumOrderWeight > args.input.maximumOrderWeight) {
                return reject(getGraphQLOutput("min/maxOrderWeight", "Max order weight less than min order weight", "MAX_LESS_THAN_MIN", null, null, null).errors);
            }
        }
        if (args.input.minimumDeliveryDays && args.input.maximumDelivminimumDeliveryDays) {
            if (args.input.minimumDeliveryDays > args.input.maximumDelivminimumDeliveryDays) {
                return reject(getGraphQLOutput("min/maxOrderWeight", "Max delivery days less than min delivery days", "MAX_LESS_THAN_MIN", null, null, null).errors);
            }
        }
        let values = getShippingMethodInputValues(args);
        productQueries.createShippingMethod(values, result => {
            if (result.err) return reject(getGraphQLOutput("createShippingMethod", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null).errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("createShippingMethod", "Shipping method not created", "GRAPHQL_ERROR", null, null, null).errors);
            let shippingMethod = result.res[0];
            resolve(shippingMethod);
        });
    });
}

function resolveShippingZoneAvailable(args) {
    return new Promise(async resolve => {
        let shippingZone = args.input.shippingZone;
        if (!shippingZone) return resolve(await assignDefaultShippingZone(args));
        productQueries.getShippingZone([shippingZone], "id=$1", async result => {
            if (result.err) return resolve(await assignDefaultShippingZone(args));
            if (result.res.length == 0) return resolve(await assignDefaultShippingZone(args));
            resolve();
        });
    });
}

function assignDefaultShippingZone(args) {
    return new Promise(resolve => {
        productQueries.getShippingZone([true], "default=$1", result => {
            if (result.err) return resolve();
            if (result.res.length == 0) return resolve();
            let shippingZone = result.res[0];
            args.input.shippingZone = shippingZone.id;
            resolve();
        });
    });
}

function getShippingMethodInputValues(args) {
    return [
        args.name,
        args.maximumOrderWeight,
        args.minimumOrderWeight,
        args.type,
        args.shippingZone,
        JSON.stringify({}),
        JSON.stringify({}),
        args.maximumDeliveryDays,
        args.minimumDeliveryDays,
        args.description
    ];
}

function createShippingMethodPostalCodeRule(args, shippingMethod_) {
    return new Promise(async(resolve, reject) => {
        let errors = [];
        if (args.input.addPostalCodeRules) {
            try {
                await createAddPostalCodeRules(args, shippingMethod_);
            } catch (err) {
                errors.concat(err);
            }
        }
        if (args.input.deletePostalCodeRules) {
            try {
                await deletePostalCodeRules(args);
            } catch (err) {
                errors.concat(err);
            }
        }

        if (errors.length > 0) return reject(errors);
        resolve();
    });
}

function createAddPostalCodeRules(args, shippingMethod_) {
    return new Promise((resolve, reject) => {
        let rules = args.input.addPostalCodeRules;
        const numRules = rules.length;
        let cursor = -1;
        let errors = [];

        rules.forEach(rule => {
            let start = rule.start;
            let end = rule.end;
            let inclusionType = args.input.inclusionType || "INCLUDE";
            let shippingMethodId = shippingMethod_.id;

            let values = [
                start,
                end,
                shippingMethodId,
                inclusionType
            ];
            productQueries.createShippingMethodPostalCodeRule(values, result => {
                if (result.err) {
                    errors.push(getGraphQLOutput("createShippingMethodPostalCodeRule", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null).errors);
                } else if (result.res.length == 0) {
                    errors.push(getGraphQLOutput("createShippingMethodPostalCodeRule", "Shipping method postal code rule not created", "GRAPHQL_ERROR", null, null, null).errors);
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
        let ruleIds = args.input.deletePostalCodeRules;
        const numRules = ruleIds.length;
        let cursor = -1;
        let errors = [];

        ruleIds.forEach(id => {
            productQueries.deleteShippingMethodPostalCodeRule([id], "id=$1", result => {
                if (result.err) {
                    errors.push(getGraphQLOutput("deleteShippingMethodPostalCodeRule", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null).errors);
                } else if (result.res.length == 0) {
                    errors.push(getGraphQLOutput("deleteShippingMethodPostalCodeRule", "Shipping method postal code rule not deleted", "GRAPHQL_ERROR", null, null, null).errors);
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
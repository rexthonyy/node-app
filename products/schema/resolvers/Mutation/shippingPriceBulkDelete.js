const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID"));

        let accessPermissions = ["MANAGE_SHIPPING"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await shippingPriceBulkDelete(args));
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

function shippingPriceBulkDelete({ ids }) {
    return new Promise(resolve => {
        const numIds = ids.length;
        let cursor = -1;
        let errors = [];

        ids.forEach(async id => {
            try {
                await shippingPriceDelete(id);
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

function shippingPriceDelete(shippingMethodId) {
    return new Promise((resolve, reject) => {
        productQueries.getShippingMethod([shippingMethodId], "id=$1", async result => {
            if (result.err) return reject(getGraphQLOutput("getShippingMethod", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("getShippingMethod", `Cannot resolve id:${shippingMethodId}`, "NOT_FOUND").errors);
            let shippingMethod_ = result.res[0];

            let errors = [];

            try {
                await deleteShippingMethodPostalCodeRule(shippingMethod_.id);
            } catch (err) {
                errors.push(err);
            }
            try {
                await deleteShippingMethodTranslation(shippingMethod_.id);
            } catch (err) {
                errors.push(err);
            }
            try {
                await deleteShippingMethodChannelListing(shippingMethod_.id);
            } catch (err) {
                errors.push(err);
            }
            try {
                await deleteShippingMethodExcludedProducts(shippingMethod_.id);
            } catch (err) {
                errors.push(err);
            }
            try {
                await deleteShippingMethod(shippingMethod_.id);
            } catch (err) {
                errors.push(err);
            }

            if (errors.length > 0) return reject(errors);
            resolve();
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

function deleteShippingMethod(shippingMethodId) {
    return new Promise(async(resolve, reject) => {
        productQueries.deleteShippingMethod([shippingMethodId], "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("deleteShippingMethod", JSON.stringify(result.err), "GRAPHQL_ERROR").errors[0]);
            resolve();
        });
    });
}
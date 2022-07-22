const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLShippingMethodTypeById,
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID", null, null, null));

        let accessPermissions = ["MANAGE_SHIPPING"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await shippingPriceExcludeProducts(authUser, args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_SHIPPING", "INVALID", null, null, null));
        }
    });
}

function getGraphQLOutput(field, message, code, warehouses, channels, shippingMethod) {
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
        shippingMethod
    }
}

function shippingPriceExcludeProducts(authUser, args) {
    return new Promise(async resolve => {
        let shippingMethodId = args.id;
        productQueries.getShippingMethod([shippingMethodId], "id=$1", result => {
            if (result.err) return resolve(getGraphQLOutput("getShippingMethod", JSON.stringify(result.err), "GRAPHQL_ERROR"));
            if (result.res.length == 0) return resolve(getGraphQLOutput("getShippingMethod", `Shipping price not found:${shippingMethodId}`, "NOT_FOUND"));
            let productIds = args.input.products;
            const numProducts = productIds.length;
            let cursor = -1;
            let errors = [];

            productIds.forEach(async productId => {
                try {
                    await addExcludeProduct(shippingMethodId, productId);
                } catch (err) {
                    errors = errors.concat(err);
                }
                checkComplete();
            });
            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numProducts) {
                    try {
                        let shippingMethod = await getGraphQLShippingMethodTypeById(shippingMethodId);
                        resolve({
                            errors,
                            shippingErrors: errors,
                            shippingMethod
                        });
                    } catch (err) {
                        resolve(getGraphQLOutput("getGraphQLShippingMethodTypeById", err, "NOT_FOUND"));
                    }
                }
            }
        });
    });
}

function addExcludeProduct(shippingMethodId, productId) {
    return new Promise(async(resolve, reject) => {
        productQueries.getProduct([productId], "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("getProduct", JSON.stringify(result.err), "GRAPHQL_ERROR"));
            if (result.res.length == 0) return reject(getGraphQLOutput("getProduct", `Product not found:${productId}`, "NOT_FOUND"));

            productQueries.getShippingMethodExcludedProducts([shippingMethodId, productId], "shippingmethod_id=$1 AND product_id=$2", async result => {
                if (result.err) return reject(getGraphQLOutput("getShippingMethodExcludedProducts", JSON.stringify(result.err), "GRAPHQL_ERROR"));
                if (result.res.length > 0) return reject(getGraphQLOutput("getShippingMethodExcludedProducts", "Product already excluded", "ALREADY_EXISTS"));
                try {
                    resolve(await createShippingMethodExcludedProducts(shippingMethodId, productId));
                } catch (err) {
                    return reject(err);
                }
            });
        });
    });
}

function createShippingMethodExcludedProducts(shippingMethodId, productId) {
    return new Promise(async resolve => {
        productQueries.createShippingMethodExcludedProduct([shippingMethodId, productId], async result => {
            if (result.err) return reject(getGraphQLOutput("createShippingMethodExcludedProduct", JSON.stringify(result.err), "GRAPHQL_ERROR"));
            if (result.res.length == 0) return reject(getGraphQLOutput("createShippingMethodExcludedProduct", "Failed to create shipping method excluded product", "GRAPHQL_ERROR"));
            resolve();
        });
    });
}
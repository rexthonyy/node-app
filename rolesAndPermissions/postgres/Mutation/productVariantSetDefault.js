const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLProductById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID", null, null, null));

        let accessPermissions = ["MANAGE_PRODUCTS"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await productVariantSetDefault(authUser, args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_PRODUCTS", "INVALID", null, null, null));
        }
    });
}

function getGraphQLOutput(field, message, code, attributes, values, product) {
    return {
        errors: [{
            field,
            message,
            code,
            attributes,
            values
        }],
        productErrors: [{
            field,
            message,
            code,
            attributes,
            values
        }],
        product
    }
}

function productVariantSetDefault(authUser, args) {
    return new Promise(async resolve => {
        let productId = args.productId;
        let variantId = args.variantId;

        productQueries.getProduct([productId], "id=$1", result => {
            if (result.err) return resolve(getGraphQLOutput("product", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("product", "Product not found", "NOT_FOUND", null, null, null));
            productQueries.getProductVariant([variantId], "id=$1", result => {
                if (result.err) return resolve(getGraphQLOutput("productvariant", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
                if (result.res.length == 0) return resolve(getGraphQLOutput("productvariant", "Product variant not found", "NOT_FOUND", null, null, null));

                productQueries.updateProduct([productId, variantId], "default_variant_id=$2", "id=$1", async result => {
                    if (result.err) return resolve(getGraphQLOutput("product", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
                    if (result.res.length == 0) return resolve(getGraphQLOutput("product", "Product not updated", "GRAPHQL_ERROR", null, null, null));

                    try {
                        let product = await getGraphQLProductById(productId);
                        resolve({
                            errors: [],
                            productErrors: [],
                            product
                        });
                    } catch (err) {
                        return resolve(getGraphQLOutput("product", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
                    }
                });
            });
        });
    });
}
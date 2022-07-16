const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLProductVariantById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID", null, null, null));

        let accessPermissions = ["MANAGE_PRODUCTS"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await productVariantPreorderDeactivate(authUser, args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_PRODUCTS", "INVALID", null, null, null));
        }
    });
}

function getGraphQLOutput(field, message, code, attributes, values, productVariant) {
    return {
        errors: [{
            field,
            message,
            code,
            attributes,
            values
        }],
        productVariant
    }
}

function productVariantPreorderDeactivate(authUser, args) {
    return new Promise(async resolve => {
        let productVariantId = args.id;
        productQueries.getProductVariant([productVariantId], "id=$1", result => {
            if (result.err) return resolve(getGraphQLOutput("getProductVariant", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("getProductVariant", "ProductVariant not found", "NOT_FOUND", null, null, null));
            let productVariant_ = result.res[0];

            productQueries.updateProductVariant([productVariantId, false, null, null, new Date().toUTCString()], "is_preorder=$2, preorder_end_date=$3, preorder_global_threshold=$4, updated_at=$5", "id=$1", async result => {
                if (result.err) return resolve(getGraphQLOutput("updateProductVariant", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
                if (result.res.length == 0) return resolve(getGraphQLOutput("updateProductVariant", "ProductVariant not updated", "GRAPHQL_ERROR", null, null, null));
                try {
                    let productVariant = await getGraphQLProductVariantById(productVariantId);
                    resolve({
                        errors: [],
                        productVariant
                    });
                } catch (err) {
                    resolve(getGraphQLOutput("getGraphQLProductVariantById", err, "GRAPHQL_ERROR", null, null, null));
                }
            });
        });
    });
}
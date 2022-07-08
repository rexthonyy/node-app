const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLProductTypeById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID", null, null, null));

        let accessPermissions = ["MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await productTypeDelete(authUser, args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES", "INVALID", null, null, null));
        }
    });
}

function getGraphQLOutput(field, message, code, attributes, values, productType) {
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
        productType
    }
}

function productTypeDelete(authUser, args) {
    return new Promise(async resolve => {
        let productTypeId = args.id;
        let productType;

        try {
            productType = await getGraphQLProductTypeById(productTypeId);
        } catch (err) {
            return resolve(getGraphQLOutput("producttypeId", "Product type not found", "NOT_FOUND", null, null, null));
        }

        productQueries.deleteProductType([productTypeId], "id=$1", async result => {
            if (result.err) return resolve(getGraphQLOutput("producttypeId", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
            await deleteAttributeVariant(productTypeId);
            await deleteAttributeProduct(productTypeId);
            resolve({
                errors: [],
                productErrors: [],
                productType
            });
        });
    });
}

function deleteAttributeVariant(id) {
    return new Promise(resolve => {
        productQueries.deleteAttributeVariant([id], "product_type_id=$1", result => {
            resolve();
        });
    });
}

function deleteAttributeProduct(id) {
    return new Promise(resolve => {
        productQueries.deleteAttributeProduct([id], "product_type_id=$1", result => {
            resolve();
        });
    });
}
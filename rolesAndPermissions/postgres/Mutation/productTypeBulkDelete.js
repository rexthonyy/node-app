const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID", null, null, 0));

        let accessPermissions = ["MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await productTypeBulkDelete(args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES", "INVALID", null, null, 0));
        }
    });
}

function getGraphQLOutput(field, message, code, attributes, values, count) {
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
        count
    }
}

function productTypeBulkDelete({ ids }) {
    return new Promise(async resolve => {
        const numIds = ids.length;
        let cursor = -1;

        ids.forEach(async id => {
            try {
                await productTypeDelete(id);
            } catch (err) {
                return resolve(err);
            }
            checkComplete();
        });

        checkComplete();

        function checkComplete() {
            cursor++;
            if (cursor == numIds) {
                resolve({
                    errors: [],
                    productErrors: [],
                    count: numIds
                });
            }
        }
    });
}

function productTypeDelete(productTypeId) {
    return new Promise(async(resolve, reject) => {
        productQueries.deleteProductType([productTypeId], "id=$1", async result => {
            if (result.err) return reject(getGraphQLOutput("producttypeId", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
            await deleteAttributeVariant(productTypeId);
            await deleteAttributeProduct(productTypeId);
            resolve();
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
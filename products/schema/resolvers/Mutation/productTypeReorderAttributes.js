const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLProductTypeById
} = require('../lib');
const kratosQueries = require("../../../postgres/kratos-queries");
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID", null, null));

        let accessPermissions = ["MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            try {
                resolve(await productTypeReorderAttributes(args));
            } catch (err) {
                reject(err);
            }
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_PRODUCTS", "INVALID", null, null));
        }
    });
}

function getGraphQLOutput(field, message, code, attributes, values, productType = null) {
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

function productTypeReorderAttributes(args) {
    return new Promise((resolve, reject) => {
        let productTypeId = args.productTypeId;
        let moves = args.moves;
        let type = args.type;
        productQueries.getProductType([productTypeId], "id=$1", async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject(`Cannot resolve productId: ${productTypeId}`);

            const numMoves = moves.length;
            let cursor = -1;

            moves.forEach(async move => {
                if (type == "PRODUCT") {
                    try {
                        await reorderProductAttributes(move);
                    } catch (err) {}
                } else if (type == "VARIANT") {
                    try {
                        await reorderVariantAttributes(move);
                    } catch (err) {}

                }
                checkComplete();
            });

            checkComplete();

            async function checkComplete() {
                cursor++;
                if (cursor == numMoves) {
                    let productType = await getGraphQLProductTypeById(productId);
                    resolve({
                        errors: [],
                        productErrors: [],
                        productType
                    });
                }
            }
        });
    });
}

function reorderProductAttributes(move) {
    return new Promise((resolve, reject) => {
        productQueries.getAttributeProduct([move.id], "id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Product Attribute found");
            let productAttribute = result.res[0];
            productAttribute.sort_order = productAttribute.sort_order || 0;
            productAttribute.sort_order += move.sortOrder;
            productQueries.updateAttributeProduct([productAttribute.id, productAttribute.sort_order], "sort_order=$2", "id=$1", result => {
                resolve();
            });
        });
    });
}

function reorderVariantAttributes(move) {
    return new Promise((resolve, reject) => {
        productQueries.getAttributeVariant([move.id], "id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Variant Attribute found");
            let variantAttribute = result.res[0];
            variantAttribute.sort_order = variantAttribute.sort_order || 0;
            variantAttribute.sort_order += move.sortOrder;
            productQueries.updateAttributeVariant([variantAttribute.id, variantAttribute.sort_order], "sort_order=$2", "id=$1", result => {
                resolve();
            });
        });
    });
}
const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLProductById
} = require('../lib');
const kratosQueries = require("../../../postgres/kratos-queries");
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID", null, null));

        let accessPermissions = ["MANAGE_PRODUCTS"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            try {
                resolve(await productVariantReorder(authUser, args));
            } catch (err) {
                reject(err);
            }
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_PRODUCTS", "INVALID", null, null));
        }
    });
}

function getGraphQLOutput(field, message, code, attributes, values, product = null) {
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

function productVariantReorder(authUser, args) {
    return new Promise((resolve, reject) => {
        let productId = args.productId;
        let moves = args.moves;
        productQueries.getProduct([productId], "id=$1", async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject(`Cannot resolve productId: ${productId}`);

            const numMoves = moves.length;
            let cursor = -1;

            moves.forEach(async move => {
                try {
                    await reorderProductVariant(move);
                } catch (err) {}
                checkComplete();
            });

            checkComplete();

            async function checkComplete() {
                cursor++;
                if (cursor == numMoves) {
                    let product = await getGraphQLProductById(productId);
                    resolve({
                        errors: [],
                        productErrors: [],
                        product
                    });
                }
            }
        });
    });
}

function reorderProductVariant(move) {
    return new Promise((resolve, reject) => {
        productQueries.getProductVariant([move.id], "id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Variant not found");
            let productVariant = result.res[0];
            productVariant.sort_order = productVariant.sort_order || 0;
            productVariant.sort_order += move.sortOrder;
            productQueries.updateProductVariant([productVariant.id, productVariant.sort_order, new Date().toUTCString()], "sort_order=$2, updated_at=$3", "id=$1", result => {
                resolve();
            });
        });
    });
}
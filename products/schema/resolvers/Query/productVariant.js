const {
    checkAuthorization,
    getGraphQLProductVariantById,
    userPermissionGroupHasAccess,
    userHasAccess
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return reject(message);

        let includeUnpublishedItems = false;
        let permissions = ["MANAGE_ORDERS", "MANAGE_DISCOUNTS", "MANAGE_PRODUCTS"];

        if (userHasAccess(authUser.userPermissions, permissions) || userPermissionGroupHasAccess(authUser.permissionGroups, permissions)) {
            includeUnpublishedItems = true;
        }

        let id = args.id;
        let sku = args.sku;
        let channel = args.channel;
        try {
            if (id) {
                return resolve(await getProductVariantById(id, channel, includeUnpublishedItems));
            } else if (sku) {
                return resolve(await getProductVariantBySku(sku, channel, includeUnpublishedItems));
            } else {
                reject("Please enter either the product variant id or product variant sku");
            }
        } catch (err) {
            reject(err);
        }
    });
}

function getProductVariantById(id, channel, includeUnpublishedItems) {
    return new Promise((resolve, reject) => {
        productQueries.getProductVariant([id], "id=$1", async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject(`Could'nt resolve id: ${id}`);
            let productVariant = result.res[0];
            resolve(await getGraphQLProductVariantById(productVariant.id));
        });
    });
}

function getProductVariantBySku(sku, channel, includeUnpublishedItems) {
    return new Promise((resolve, reject) => {
        productQueries.getProductVariant([sku], "sku=$1", async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject(`Could'nt resolve sku: ${sku}`);
            let productVariant = result.res[0];
            resolve(await getGraphQLProductVariantById(productVariant.id));
        });
    });
}
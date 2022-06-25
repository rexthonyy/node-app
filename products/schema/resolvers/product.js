const {
    checkAuthorization,
    getGraphQLProductById,
    userPermissionGroupHasAccess,
    userHasAccess
} = require('./lib');
const productQueries = require("../../postgres/product-queries");

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
        let slug = args.slug;
        let channel = args.channel;

        if (id) {
            return resolve(await getProductById(id, channel, includeUnpublishedItems));
        } else if (slug) {
            return resolve(await getProductBySlug(slug, channel, includeUnpublishedItems));
        } else {
            reject("Please enter either the product id or product slug");
        }
    });
}

function getProductById(id, channel, includeUnpublishedItems) {
    return new Promise((resolve, reject) => {
        productQueries.getProduct([id], "id=$1", async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length) return reject(`Could'nt resolve id: ${id}`);
            let product = result.res[0];
            resolve(await getGraphQLProductById(product.id));
        });
    });
}

function getProductBySlug(slug, channel, includeUnpublishedItems) {
    return new Promise((resolve, reject) => {
        productQueries.getProduct([slug], "slug=$1", async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length) return reject(`Could'nt resolve id: ${id}`);
            let product = result.res[0];
            resolve(await getGraphQLProductById(product.id));
        });
    });
}
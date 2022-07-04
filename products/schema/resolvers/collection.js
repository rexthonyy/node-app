const {
    checkAuthorization,
    getGraphQLCollectionById,
    userPermissionGroupHasAccess,
    userHasAccess
} = require('./lib');
const productQueries = require("../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return reject(message);

        let includeUnpublishedItems = false;
        let accessPermissions = ["MANAGE_ORDERS", "MANAGE_DISCOUNTS", "MANAGE_PRODUCTS"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            includeUnpublishedItems = true;
        }

        let id = args.id;
        let slug = args.slug;
        let channel = args.channel;
        try {
            if (id) {
                return resolve(await getCollectionById(id, channel, includeUnpublishedItems));
            } else if (slug) {
                return resolve(await getCollectionBySlug(slug, channel, includeUnpublishedItems));
            } else {
                reject("Please enter either the product id or product slug");
            }
        } catch (err) {
            reject(err);
        }
    });
}

function getCollectionById(id, channel, includeUnpublishedItems) {
    return new Promise((resolve, reject) => {
        productQueries.getCollection([id], "id=$1", async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject(`Could'nt resolve id: ${id}`);
            let collection = result.res[0];
            resolve(await getGraphQLCollectionById(collection.id, channel));
        });
    });
}

function getCollectionBySlug(slug, channel, includeUnpublishedItems) {
    return new Promise((resolve, reject) => {
        productQueries.getCollection([slug], "slug=$1", async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject(`Could'nt resolve slug: ${slug}`);
            let collection = result.res[0];
            resolve(await getGraphQLCollectionById(collection.id, channel));
        });
    });
}
const {
    checkAuthorization,
    getGraphQLProductById,
    userPermissionGroupHasAccess,
    userHasAccess
} = require('./lib');

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return reject(JSON.stringify(status, message));

        let includeUnpublishedItems = false;
        let permissions = ["MANAGE_ORDERS", "MANAGE_DISCOUNTS", "MANAGE_PRODUCTS"];

        if (userHasAccess(authUser.userPermissions, permissions) || userPermissionGroupHasAccess(authUser.permissionGroups, permissions)) {
            includeUnpublishedItems = true;
        }

        let id = args.id;
        let slug = args.slug;
        let channel = args.channel;

        resolve(await products(id, slug, channel, includeUnpublishedItems));
    });
}

function products(id, slug, channel, includeUnpublishedItems) {
    return new Promise(resolve => {
        console.log(id, slug, channel, includeUnpublishedItems);
        resolve(getGraphQLProductById(1));
    });
}
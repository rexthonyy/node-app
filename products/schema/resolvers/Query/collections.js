const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLCollectionById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return reject(message);

        let includeUnpublishedItems = false;
        let accessPermissions = ["MANAGE_ORDERS", "MANAGE_DISCOUNTS", "MANAGE_PRODUCTS"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            includeUnpublishedItems = true;
        }
        try {
            resolve(await collections(authUser, args, includeUnpublishedItems));
        } catch (err) {
            reject(err);
        }
    });
}

function collections(authUser, args, includeUnpublishedItems) {
    return new Promise(async(resolve, reject) => {
        try {
            let edges = await getAllCollections(includeUnpublishedItems);
            resolve({
                pageInfo: {
                    hasNextPage: false,
                    hasPreviousPage: false,
                    startCursor: "",
                    endCursor: ""
                },
                edges,
                totalCount: edges.length
            });
        } catch (err) {
            reject(err);
        }
    });
}

function getAllCollections(includeUnpublishedItems) {
    return new Promise((resolve, reject) => {
        productQueries.getCollection([-1], "id <> $1", result => {
            if (result.err) { return reject(JSON.stringify(result.err)); }
            let collections = result.res;

            const numCollections = collections.length;
            let cursor = -1;
            let edges = [];

            collections.forEach(async collection => {
                let node = await getGraphQLCollectionById(collection.id);
                edges.push({
                    cursor: "",
                    node
                });

                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numCollections) {
                    resolve(edges);
                }
            }
        });
    })
}
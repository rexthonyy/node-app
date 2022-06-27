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
        let accessPermissions = ["MANAGE_ORDERS", "MANAGE_DISCOUNTS", "MANAGE_PRODUCTS"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            includeUnpublishedItems = true;
        }
        try {
            resolve(await products(authUser, args, includeUnpublishedItems));
        } catch (err) {
            reject(err);
        }
    });
}


function products(authUser, args, includeUnpublishedItems) {
    return new Promise(async(resolve, reject) => {
        try {
            let edges = await getAllProducts(includeUnpublishedItems);
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

function getAllProducts(includeUnpublishedItems) {
    return new Promise((resolve, reject) => {
        productQueries.getProduct([-1], "id <> $1", result => {
            if (result.err) { return reject(JSON.stringify(result.err)); }
            let products = result.res;

            const numProducts = products.length;
            let cursor = -1;
            let edges = [];

            products.forEach(async product => {
                let node = await getGraphQLProductById(product.id);
                edges.push({
                    cursor: "",
                    node
                });

                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numProducts) {
                    resolve(edges);
                }
            }
        });
    })
}
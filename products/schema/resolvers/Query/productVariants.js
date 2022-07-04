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
        try {
            resolve(await productVariants(args, includeUnpublishedItems));
        } catch (err) {
            reject(err);
        }
    });
}

function productVariants(args, includeUnpublishedItems) {
    return new Promise(async(resolve, reject) => {
        try {
            let edges = await getAllProductVariants(includeUnpublishedItems);
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


function getAllProductVariants(includeUnpublishedItems) {
    return new Promise((resolve, reject) => {
        productQueries.getProductVariant([-1], "id <> $1", result => {
            if (result.err) { return reject(JSON.stringify(result.err)); }
            let productVariantValues = result.res;

            const numProductVariants = productVariantValues.length;
            let cursor = -1;
            let edges = [];

            productVariantValues.forEach(async productVariant => {
                let node = await getGraphQLProductVariantById(productVariant.id);
                edges.push({
                    cursor: "",
                    node
                });

                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numProductVariants) {
                    resolve(edges);
                }
            }
        });
    })
}
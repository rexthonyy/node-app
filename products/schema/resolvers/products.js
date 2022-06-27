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
    return new Promise(resolve => {
        productQueries.getProduct([-1], "id <> $1", result => {
            if (result.err) { return reject(JSON.stringify(result.err)); }
            let products = result.res;
            console.log(products);
            return resolve(null);
            const numProducts = products.length;
            let cursor = -1;
            let edges = [];

            authGroups.forEach(async authGroup => {
                const users = await getUsersInGroupId(authGroup.id);
                const permissions = await getAuthGroupPermissionsByGroupId(authGroup.id);
                let authUserPermissions = authUser ? (authUser.userPermissions ? authUser.userPermissions : []) : [];
                let userCanManage = false;

                for (let i = 0, j = authUserPermissions.length; i < j; i++) {
                    if (authUserPermissions[i].code == "MANAGE_USERS") {
                        userCanManage = true;
                        break;
                    }
                }

                edges.push({
                    cursor: "",
                    node: {
                        id: authGroup.id,
                        name: authGroup.name,
                        users,
                        permissions,
                        userCanManage
                    }
                });

                checkAuthGroupComplete();
            });

            checkAuthGroupComplete();

            function checkAuthGroupComplete() {
                countAuthGroups++;
                if (countAuthGroups == numAuthGroups) {
                    filterAndSortPermissions(resolve, reject, args, edges);
                }
            }
        });
    });
}
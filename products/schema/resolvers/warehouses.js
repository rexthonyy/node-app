const {
    checkAuthorization,
    getGraphQLWarehouseById,
    userPermissionGroupHasAccess,
    userHasAccess
} = require('./lib');
const productQueries = require("../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return reject(message);

        let permissions = ["MANAGE_PRODUCTS", "MANAGE_ORDERS", "MANAGE_SHIPPING"];

        if (userHasAccess(authUser.userPermissions, permissions) || userPermissionGroupHasAccess(authUser.permissionGroups, permissions)) {
            resolve(warehouses(args));
        } else {
            reject("You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_PRODUCTS, MANAGE_ORDERS, MANAGE_SHIPPING");
        }
    });
}

function warehouses(args) {
    return new Promise(async(resolve, reject) => {
        try {
            let edges = await getAllWarehouses();
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

function getAllWarehouses() {
    return new Promise((resolve, reject) => {
        productQueries.getWarehouse([-1], "id <> $1", result => {
            if (result.err) { return reject(JSON.stringify(result.err)); }
            let warehouses = result.res;

            const numWarehouses = warehouses.length;
            let cursor = -1;
            let edges = [];

            warehouses.forEach(async warehouse => {
                let node = await getGraphQLWarehouseById(warehouse.id);
                edges.push({
                    cursor: "",
                    node
                });

                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numWarehouses) {
                    resolve(edges);
                }
            }
        });
    })
}
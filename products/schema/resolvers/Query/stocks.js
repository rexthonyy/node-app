const {
    checkAuthorization,
    getGraphQLStockById,
    userPermissionGroupHasAccess,
    userHasAccess
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return reject(message);

        let permissions = ["MANAGE_PRODUCTS"];

        if (userHasAccess(authUser.userPermissions, permissions) || userPermissionGroupHasAccess(authUser.permissionGroups, permissions)) {
            resolve(stocks(args));
        } else {
            reject("You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_PRODUCTS");
        }
    });
}

function stocks(args) {
    return new Promise(async(resolve, reject) => {
        try {
            let edges = await getAllStocks();
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

function getAllStocks() {
    return new Promise((resolve, reject) => {
        productQueries.getStock([-1], "id <> $1", result => {
            if (result.err) { console.log(JSON.stringify(result.err)); return reject(JSON.stringify(result.err)); }
            let stocks = result.res;

            const numStocks = stocks.length;
            let cursor = -1;
            let edges = [];

            stocks.forEach(async stock => {
                let node = await getGraphQLStockById(stock.id);
                edges.push({
                    cursor: "",
                    node
                });

                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numStocks) {
                    resolve(edges);
                }
            }
        });
    })
}
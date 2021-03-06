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
            resolve(stock(args));
        } else {
            reject("You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_PRODUCTS");
        }
    });
}

function stock(args) {
    return new Promise((resolve, reject) => {
        productQueries.getStock([args.id], "id=$1", async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject(`Could'nt resolve id: ${args.id}`);
            let stock = result.res[0];
            resolve(await getGraphQLStockById(stock.id));
        });
    });
}
const {
    checkAuthorization,
    getGraphQLProductById,
    userPermissionGroupHasAccess,
    userHasAccess
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return reject(message);

        let permissions = ["MANAGE_ORDERS"];

        if (userHasAccess(authUser.userPermissions, permissions) || userPermissionGroupHasAccess(authUser.permissionGroups, permissions)) {
            resolve(orderSettings(authUser));
        } else {
            reject("You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_ORDERS");
        }
    });
}

function orderSettings(authUser) {
    return new Promise((resolve, reject) => {
        productQueries.getSiteSettings([1], "id=$1", async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject(`Could'nt resolve id: ${id}`);
            let setting = result.res[0];

            resolve({
                automaticallyConfirmAllNewOrders: setting.automatically_confirm_all_new_orders,
                automaticallyFulfillNonShippableGiftCard: setting.automatically_fulfill_non_shippable_gift_card
            });
        });
    });
}
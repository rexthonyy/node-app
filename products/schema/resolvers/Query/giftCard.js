const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLGiftCardById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return reject(message);

        let permissions = ["MANAGE_GIFT_CARD"];

        if (userHasAccess(authUser.userPermissions, permissions) || userPermissionGroupHasAccess(authUser.permissionGroups, permissions)) {
            try {
                resolve(getGiftCard(args));
            } catch (err) {
                reject(err);
            }
        } else {
            reject("You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_GIFT_CARD");
        }
    });
}

function getGiftCard(args) {
    return new Promise((resolve, reject) => {
        productQueries.getGiftCard([args.id], "id=$1", async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject(`Could'nt resolve id: ${args.id}`);
            let giftCard = result.res[0];
            resolve(await getGraphQLGiftCardById(giftCard.id));
        });
    });
}
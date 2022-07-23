const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return reject(message);

        let permissions = ["MANAGE_GIFT_CARD"];

        if (userHasAccess(authUser.userPermissions, permissions) || userPermissionGroupHasAccess(authUser.permissionGroups, permissions)) {
            try {
                resolve(getGiftCardCurrencies(args));
            } catch (err) {
                reject(err);
            }
        } else {
            reject("You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_GIFT_CARD");
        }
    });
}

function getGiftCardCurrencies(args) {
    return new Promise((resolve, reject) => {
        productQueries.getGiftCard([-1], "id<>$1", async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            let giftCards_ = result.res;
            const numGiftCards = giftCards_.length;
            let cursor = -1;
            let giftCardCurrencies = [];

            giftCards_.forEach(giftCard => {
                if (!giftCardCurrencies.find(currency => currency == giftCard.currency)) {
                    giftCardCurrencies.push(giftCard.currency);
                }
                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numGiftCards) {
                    resolve(giftCardCurrencies);
                }
            }
        });
    });
}
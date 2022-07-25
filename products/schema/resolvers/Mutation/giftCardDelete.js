const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLWarehouseById,
    getGraphQLGiftCardById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID"));

        let accessPermissions = ["MANAGE_GIFT_CARD"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await giftCardDelete(args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_GIFT_CARD", "INVALID"));
        }
    });
}

function getGraphQLOutput(field, message, code, tags, giftCard) {
    return {
        errors: [{
            field,
            message,
            code,
            tags
        }],
        giftCardErrors: [{
            field,
            message,
            code,
            tags
        }],
        giftCard
    }
}

function giftCardDelete(args) {
    return new Promise(resolve => {
        let giftCardId = args.id;
        productQueries.getGiftCard([giftCardId], "id=$1", async result => {
            if (result.err) return resolve(getGraphQLOutput("getGiftCard", JSON.stringify(result.err), "GRAPHQL_ERROR"));
            if (result.res.length == 0) return resolve(getGraphQLOutput("getGiftCard", `GiftCard not found: ${giftCardId}`, "NOT_FOUND"));
            let giftCard;
            let errors = [];

            try {
                giftCard = await getGraphQLGiftCardById(giftCardId);
            } catch (err) {
                errors.push(getGraphQLOutput("getGraphQLGiftCardById", err, "NOT_FOUND").errors[0]);
                giftCard = null;
            }

            try {
                await deleteGiftCardEvents(giftCardId);
            } catch (err) {
                errors = errors.concat(err);
            }

            try {
                await deleteCheckoutGiftCards(giftCardId);
            } catch (err) {
                errors = errors.concat(err);
            }

            try {
                await deleteGiftCardTags(giftCardId);
            } catch (err) {
                errors = errors.concat(err);
            }

            try {
                await deleteOrderGiftCards(giftCardId);
            } catch (err) {
                errors = errors.concat(err);
            }

            try {
                await deleteGiftCard(giftCardId);
            } catch (err) {
                errors = errors.concat(err);
            }

            resolve({
                errors,
                giftCardErrors: errors,
                giftCard
            });
        });
    });
}

function deleteGiftCardEvents(giftCardId) {
    return new Promise((resolve, reject) => {
        productQueries.deleteGiftCardEvent([giftCardId], "gift_card_id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("deleteGiftCardEvent", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            resolve();
        });
    });
}

function deleteCheckoutGiftCards(giftCardId) {
    return new Promise((resolve, reject) => {
        productQueries.deleteCheckoutGiftCards([giftCardId], "giftcard_id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("deleteCheckoutGiftCards", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            resolve();
        });
    });
}

function deleteGiftCardTags(giftCardId) {
    return new Promise((resolve, reject) => {
        productQueries.deleteGiftCardTags([giftCardId], "giftcard_id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("deleteGiftCardTags", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            resolve();
        });
    });
}

function deleteOrderGiftCards(giftCardId) {
    return new Promise((resolve, reject) => {
        productQueries.deleteOrderGiftCards([giftCardId], "giftcard_id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("deleteOrderGiftCards", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            resolve();
        });
    });
}

function deleteGiftCard(giftCardId) {
    return new Promise((resolve, reject) => {
        productQueries.deleteGiftCard([giftCardId], "id=$1", result => {
            if (result.err) return reject(getGraphQLOutput("deleteGiftCard", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            resolve();
        });
    });
}
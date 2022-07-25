const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLGiftCardById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID"));

        let accessPermissions = ["MANAGE_GIFT_CARD"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await giftCardActivate(authUser, args));
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

function giftCardActivate(authUser, args) {
    return new Promise(resolve => {
        let giftCardId = args.id;
        productQueries.getGiftCard([giftCardId], "id=$1", result => {
            if (result.err) return resolve(getGraphQLOutput("getGiftCard", JSON.stringify(result.err), "GRAPHQL_ERROR"));
            if (result.res.length == 0) return resolve(getGraphQLOutput("getGiftCard", "GiftCard not found", "NOT_FOUND"));
            let giftCard_ = result.res[0];
            if (giftCard_.is_active) return resolve(getGraphQLOutput("giftCard", "GiftCard already active", "ALREADY_EXISTS"));
            productQueries.updateGiftCard([giftCardId, true], "is_active=$2", "id=$1", async result => {
                if (result.err) return resolve(getGraphQLOutput("updateGiftCard", JSON.stringify(result.err), "GRAPHQL_ERROR"));
                if (result.res.length == 0) return resolve(getGraphQLOutput("updateGiftCard", "GiftCard not updated", "GRAPHQL_ERROR"));

                let giftCard;
                let errors = [];
                try {
                    await addEvent(authUser, giftCardId, args);
                } catch (err) {
                    errors = errors.concat(err);
                }

                try {
                    giftCard = await getGraphQLGiftCardById(giftCardId);
                } catch (err) {
                    errors.push(getGraphQLOutput("getGraphQLGiftCardById", err, "NOT_FOUND", tags).errors[0]);
                    giftCard = null;
                }

                resolve({
                    errors,
                    giftCardErrors: errors,
                    giftCard
                });
            });
        });
    });
}

function addEvent(authUser, giftCardId, args) {
    return new Promise(async(resolve, reject) => {
        let { values, entry, holder } = getGiftCardCreateEventInput(authUser, giftCardId, args.input);
        productQueries.createGiftCardEvent(values, entry, holder, async result => {
            if (result.err) return reject(getGraphQLOutput("createGiftCardEvent", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("createGiftCardEvent", "GiftCard event not created", "GRAPHQL_ERROR").errors);
            resolve();
        });
    });
}


function getGiftCardCreateEventInput(authUser, giftCardId, input) {

    let expiryDate = input.expiryDate;
    let endDate = input.endDate;

    expiryDate = expiryDate ? expiryDate : endDate;

    let parameters = {
        balance: {
            currency: input.balance.currency,
            current_balance: input.balance.amount,
            initial_balance: input.balance.amount
        },
        expiry_date: expiryDate
    };

    let values = [
        new Date().toUTCString(),
        "ACTIVATED",
        JSON.stringify(parameters),
        giftCardId,
        authUser.id
    ];
    let entry = `"date",type,parameters,gift_card_id,user_id`;
    let holder = "$1,$2,$3,$4,$5";
    return { values, entry, holder };
}
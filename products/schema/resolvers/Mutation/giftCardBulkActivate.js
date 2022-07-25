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
            resolve(await giftCardBulkActivate(authUser, args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_GIFT_CARD", "INVALID"));
        }
    });
}

function getGraphQLOutput(field, message, code, tags, count) {
    return {
        errors: [{
            field,
            message,
            code,
            tags
        }],
        count
    }
}

function giftCardBulkActivate(authUser, args) {
    return new Promise(resolve => {
        let ids = args.ids;
        const numIds = ids.length;
        let errors = [];
        let count = 0;
        let cursor = -1;

        ids.forEach(async id => {
            try {
                await giftCardActivate(authUser, id);
                count++;
            } catch (err) {
                errors = errors.concat(err);
            }
            checkComplete();
        });

        checkComplete();

        function checkComplete() {
            cursor++;
            if (cursor == numIds) {
                resolve({
                    errors,
                    count
                })
            }
        }
    });
}

function giftCardActivate(authUser, giftCardId) {
    return new Promise(resolve => {
        productQueries.getGiftCard([giftCardId], "id=$1", result => {
            if (result.err) return resolve(getGraphQLOutput("getGiftCard", JSON.stringify(result.err), "GRAPHQL_ERROR"));
            if (result.res.length == 0) return resolve(getGraphQLOutput("getGiftCard", "GiftCard not found", "NOT_FOUND"));
            let giftCard_ = result.res[0];
            if (giftCard_.is_active) return resolve(getGraphQLOutput("giftCard", "GiftCard already activated", "ALREADY_EXISTS"));
            productQueries.updateGiftCard([giftCardId, true], "is_active=$2", "id=$1", async result => {
                if (result.err) return resolve(getGraphQLOutput("updateGiftCard", JSON.stringify(result.err), "GRAPHQL_ERROR"));
                if (result.res.length == 0) return resolve(getGraphQLOutput("updateGiftCard", "GiftCard not updated", "GRAPHQL_ERROR"));

                let giftCard;
                let errors = [];
                try {
                    await addEvent(authUser, giftCardId, giftCard_);
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

function addEvent(authUser, giftCardId, card) {
    return new Promise(async(resolve, reject) => {
        let { values, entry, holder } = getGiftCardCreateEventInput(authUser, giftCardId, card);
        productQueries.createGiftCardEvent(values, entry, holder, async result => {
            if (result.err) return reject(getGraphQLOutput("createGiftCardEvent", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("createGiftCardEvent", "GiftCard event not created", "GRAPHQL_ERROR").errors);
            resolve();
        });
    });
}


function getGiftCardCreateEventInput(authUser, giftCardId, input) {
    let parameters = {
        balance: {
            currency: input.currency,
            current_balance: input.current_balance_amount,
            initial_balance: input.initial_balance_amount
        },
        expiry_date: input.expiry_date
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
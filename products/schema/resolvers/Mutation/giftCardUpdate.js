const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLGiftCardById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");
const kratosQueries = require("../../../postgres/kratos-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID"));

        let accessPermissions = ["MANAGE_GIFT_CARD"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await giftCardUpdate(authUser, args));
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

function giftCardUpdate(authUser, args) {
    return new Promise(resolve => {
        let giftCardId = args.id;
        productQueries.getGiftCard([giftCardId], "id=$1", async result => {
            if (result.err) return reject(getGraphQLOutput("getGiftCard", JSON.stringify(result.err), "GRAPHQL_ERROR"));
            if (result.res.length == 0) return reject(getGraphQLOutput("getGiftCard", "GiftCard not found", "NOT_FOUND"));
            let giftCard_ = result.res[0];

            let addTags = args.input.addTags;
            let expiryDate = args.input.expiryDate;
            let startDate = args.input.startDate;
            let endDate = args.input.endDate;
            let removeTags = args.input.removeTags;
            let balanceAmount = args.input.balanceAmount;

            let errors = [];
            let giftCard;

            try {
                if (addTags) await addGiftCardTags(authUser, giftCard_, addTags);
            } catch (err) {
                errors = errors.concat(err);
            }
            try {
                if (expiryDate) await updateGiftCardExpiryDate(authUser, giftCard_, expiryDate);
            } catch (err) {
                errors = errors.concat(err);
            }
            try {
                if (startDate) await updateGiftCardStartDate(authUser, giftCard_, startDate);
            } catch (err) {
                errors = errors.concat(err);
            }
            try {
                if (endDate) await updateGiftCardEndDate(authUser, giftCard_, endDate);
            } catch (err) {
                errors = errors.concat(err);
            }
            try {
                if (removeTags) await removeGiftCardTags(authUser, giftCard_, removeTags);
            } catch (err) {
                errors = errors.concat(err);
            }
            try {
                if (balanceAmount) await updateGiftCardBalanceAmount(authUser, giftCard_, balanceAmount);
            } catch (err) {
                errors = errors.concat(err);
            }

            try {
                giftCard = await getGraphQLGiftCardById(giftCardId);
            } catch (err) {
                errors.push(getGraphQLOutput("getGraphQLGiftCardById", err, "NOT_FOUND").errors[0]);
            }

            resolve({
                errors,
                giftCardErrors: errors,
                giftCard
            });
        });
    });
}

function addGiftCardTags(authUser, giftCard, tags) {
    return new Promise((resolve, reject) => {
        const numTags = tags.length;
        let errors = [];
        let cursor = -1;

        tags.forEach(async tag => {
            try {
                await resolveGiftCardTag(authUser, giftCard, tag);
            } catch (err) {
                errors = errors.concat(err);
            }
            checkComplete();
        });

        checkComplete();

        function checkComplete() {
            cursor++;
            if (cursor == numTags) {
                if (errors.length > 0) return reject(errors);
                resolve();
            }
        }
    });
}

function resolveGiftCardTag(authUser, giftCard, tag) {
    return new Promise((resolve, reject) => {
        productQueries.getGiftCardTag([tag], "name=$1", async result => {
            if (result.err) return reject(getGraphQLOutput("getGiftCardTag", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            let giftCardTagId;
            if (result.res.length > 0) {
                giftCardTagId = result.res[0].id;
            } else {
                try {
                    let giftCardTag = await createGiftCardTag(tag);
                    giftCardTagId = giftCardTag.id;
                } catch (err) {
                    return reject(err);
                }
            }
            productQueries.getGiftCardTags([giftCard.id, giftCardTagId], "giftcard_id=$1 AND giftcardtag_id=$2", result => {
                if (result.err) return reject(getGraphQLOutput("getGiftCardTags", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
                if (result.res.length > 0) return reject(getGraphQLOutput("getGiftCardTags", `Gift card tag already exists: ${tag}`, "ALREADY_EXISTS").errors);
                productQueries.createGiftCardTags([giftCard.id, giftCardTagId], "giftcard_id, giftcardtag_id", "$1,$2", async result => {
                    if (result.err) return reject(getGraphQLOutput("createGiftCardTags", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
                    if (result.res.length == 0) return reject(getGraphQLOutput("createGiftCardTags", `Gift card tag not created: ${tag}`, "GRAPHQL_ERROR").errors);
                    let errors = [];
                    try {
                        await addEvent(authUser, giftCard, "TAGS_UPDATED");
                    } catch (err) {
                        errors = errors.concat(err);
                    }
                    if (errors.length > 0) return reject(errors);
                    resolve();
                });
            });
        });
    });
}

function createGiftCardTag(tag) {
    return new Promise((resolve, reject) => {
        productQueries.createGiftCardTag([tag], "name", "$1", result => {
            if (result.err) return reject(getGraphQLOutput("createGiftCardTag", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("createGiftCardTag", `Gift card tag not created: ${tag}`, "GRAPHQL_ERROR").errors);
            resolve(result.res[0]);
        });
    });
}

function updateGiftCardExpiryDate(authUser, giftCard, expiryDate) {
    return new Promise((resolve, reject) => {
        productQueries.updateGiftCard([giftCard.id, expiryDate], "expiry_date=$2", "id=$1", async result => {
            if (result.err) return reject(getGraphQLOutput("updateGiftCard", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("updateGiftCard", `GiftCard expiryDate not updated: ${expiryDate}`, "GRAPHQL_ERROR").errors);
            let errors = [];
            try {
                await addEvent(authUser, giftCard, "EXPIRY_DATE_UPDATED");
            } catch (err) {
                errors = errors.concat(err);
            }
            if (errors.length > 0) return reject(errors);
            resolve();
        });
    });
}

function updateGiftCardStartDate(authUser, giftCard, startDate) {
    return new Promise((resolve, reject) => {
        productQueries.updateGiftCard([giftCard.id, startDate], "created=$2", "id=$1", async result => {
            if (result.err) return reject(getGraphQLOutput("updateGiftCard", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("updateGiftCard", `GiftCard startDate not updated: ${startDate}`, "GRAPHQL_ERROR").errors);
            let errors = [];
            try {
                await addEvent(authUser, giftCard, "UPDATED");
            } catch (err) {
                errors = errors.concat(err);
            }
            if (errors.length > 0) return reject(errors);
            resolve();
        });
    });
}

function updateGiftCardEndDate(authUser, giftCard, endDate) {
    return new Promise((resolve, reject) => {
        productQueries.updateGiftCard([giftCard.id, endDate], "expiry_date=$2", "id=$1", async result => {
            if (result.err) return reject(getGraphQLOutput("updateGiftCard", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("updateGiftCard", `GiftCard endDate not updated: ${endDate}`, "GRAPHQL_ERROR").errors);
            let errors = [];
            try {
                await addEvent(authUser, giftCard, "EXPIRY_DATE_UPDATED");
            } catch (err) {
                errors = errors.concat(err);
            }
            if (errors.length > 0) return reject(errors);
            resolve();
        });
    });
}

function removeGiftCardTags(authUser, giftCard, tags) {
    return new Promise((resolve, reject) => {
        const numTags = tags.length;
        let errors = [];
        let cursor = -1;

        tags.forEach(async tag => {
            try {
                await resolveRemoveGiftCardTag(authUser, giftCard, tag);
            } catch (err) {
                errors = errors.concat(err);
            }
            checkComplete();
        });

        checkComplete();

        function checkComplete() {
            cursor++;
            if (cursor == numTags) {
                if (errors.length > 0) return reject(errors);
                resolve();
            }
        }
    });
}


function resolveRemoveGiftCardTag(authUser, giftCard, tag) {
    return new Promise((resolve, reject) => {
        productQueries.getGiftCardTag([tag], "name=$1", async result => {
            if (result.err) return reject(getGraphQLOutput("getGiftCardTag", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("getGiftCardTag", `GiftCard tag not found: ${tag}`, "NOT_FOUND").errors);
            let giftCardTagId = result.res[0].id;

            productQueries.getGiftCardTags([giftCard.id, giftCardTagId], "giftcard_id=$1 AND giftcardtag_id=$2", result => {
                if (result.err) return reject(getGraphQLOutput("getGiftCardTags", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
                if (result.res.length == 0) return reject(getGraphQLOutput("getGiftCardTags", `Gift card tags not found: ${tag}`, "NOT_FOUND").errors);
                productQueries.deleteGiftCardTags([giftCard.id, giftCardTagId], "giftcard_id=$1 AND giftcardtag_id=$2", async result => {
                    if (result.err) return reject(getGraphQLOutput("deleteGiftCardTags", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
                    if (result.res.length > 0) return reject(getGraphQLOutput("deleteGiftCardTags", `Gift card tag not removed: ${tag}`, "GRAPHQL_ERROR").errors);
                    let errors = [];
                    try {
                        await addEvent(authUser, giftCard, "TAGS_UPDATED");
                    } catch (err) {
                        errors = errors.concat(err);
                    }
                    if (errors.length > 0) return reject(errors);
                    resolve();
                });
            });
        });
    });
}

function updateGiftCardBalanceAmount(authUser, giftCard, balanceAmount) {
    return new Promise((resolve, reject) => {
        productQueries.updateGiftCard([giftCard.id, balanceAmount], "initial_balance_amount=$2, current_balance_amount=$2", "id=$1", async result => {
            if (result.err) return reject(getGraphQLOutput("updateGiftCard", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("updateGiftCard", `Gift card balance not updated: ${balanceAmount}`, "GRAPHQL_ERROR").errors);
            let errors = [];
            try {
                await addEvent(authUser, giftCard, "BALANCE_RESET");
            } catch (err) {
                errors = errors.concat(err);
            }
            if (errors.length > 0) return reject(errors);
            resolve();
        });
    });
}


function addEvent(authUser, giftCard, type) {
    return new Promise(async(resolve, reject) => {
        let { values, entry, holder } = getGiftCardCreateEventInput(authUser, giftCard, type);
        productQueries.createGiftCardEvent(values, entry, holder, async result => {
            if (result.err) return reject(getGraphQLOutput("createGiftCardEvent", JSON.stringify(result.err), "GRAPHQL_ERROR").errors);
            if (result.res.length == 0) return reject(getGraphQLOutput("createGiftCardEvent", "GiftCard event not created", "GRAPHQL_ERROR").errors);
            resolve();
        });
    });
}


function getGiftCardCreateEventInput(authUser, giftCard, type) {
    let parameters = {
        balance: {
            currency: giftCard.currency,
            current_balance: giftCard.current_balance_amount,
            initial_balance: giftCard.initial_balance_amount
        },
        expiry_date: giftCard.expiry_date
    };

    let values = [
        new Date().toUTCString(),
        type,
        JSON.stringify(parameters),
        giftCard.id,
        authUser.id
    ];
    let entry = `"date",type,parameters,gift_card_id,user_id`;
    let holder = "$1,$2,$3,$4,$5";
    return { values, entry, holder };
}
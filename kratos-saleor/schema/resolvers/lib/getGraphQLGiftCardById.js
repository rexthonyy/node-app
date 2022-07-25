const { formatMetadata } = require("../../../libs/util");
const productQueries = require("../../../postgres/product-queries");
const getGraphQLUserById = require("./getGraphQLUserById");
let getGraphQLGiftCardById = (id) => {
    return new Promise((resolve, reject) => {
        productQueries.getGiftCard([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                reject("Giftcard not found");
            } else {
                let giftcard = result.res[0];
                let user;
                let createdBy;
                let usedBy;
                let createdByEmail;
                let usedByEmail;
                let app;
                let product;
                let tags;
                let initialBalance;
                let currentBalance;

                try {
                    createdBy = await getGraphQLUserById(giftcard.created_by_id);
                    createdByEmail = createdBy.email;
                } catch (err) {
                    createdBy = null;
                    createdByEmail = null;
                }

                try {
                    usedBy = await getGraphQLUserById(giftcard.used_by_id);
                    user = usedBy;
                    usedByEmail = usedBy.email;
                } catch (err) {
                    usedBy = null;
                    usedByEmail = null;
                    user = null;
                }

                try {
                    tags = await getGiftCardTags(giftcard.id);
                } catch (err) {
                    tags = null;
                }

                try {
                    initialBalance = await getInitialBalance(giftcard);
                } catch (err) {
                    initialBalance = null;
                }

                try {
                    currentBalance = await getCurrentBalance(giftcard);
                } catch (err) {
                    currentBalance = null;
                }

                resolve({
                    id: giftcard.id,
                    privateMetadata: formatMetadata(giftcard.private_metadata),
                    metadata: formatMetadata(giftcard.metadata),
                    displayCode: giftcard.code,
                    last4CodeChars: giftcard.last_change,
                    code: giftcard.code,
                    created: giftcard.created,
                    createdBy,
                    usedBy,
                    createdByEmail,
                    usedByEmail,
                    lastUsedOn: giftcard.last_used_on,
                    expiryDate: giftcard.expiry_date,
                    app,
                    product,
                    tags,
                    boughtInChannel: "",
                    isActive: giftcard.is_active,
                    initialBalance,
                    currentBalance,
                    user,
                    endDate: giftcard.expiry_date,
                    startDate: giftcard.created
                });
            }
        });
    });
};

function getGiftCardTags(id) {
    return new Promise((resolve, reject) => {
        productQueries.getGiftCardTags([id], "giftcard_id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            let giftcardTags = result.res;
            const numTags = giftcardTags.length;
            let cursor = -1;
            let giftCards = [];

            giftcardTags.forEach(async tag => {
                giftCards.push(await getGiftCardTag(tag.giftcardtag_id));
                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numTags) {
                    resolve(giftCards);
                }
            }
        });
    });
}

function getGiftCardTag(id) {
    return new Promise((resolve, reject) => {
        productQueries.getGiftCard([id], "id=$1", result => {
            if (result.err || result.res.length == 0) return reject("Gift card tag not found");
            let tag = result.res[0];

            resolve({
                id: tag.id,
                name: tag.name
            });
        });
    });
}

function getInitialBalance(giftCard) {
    return new Promise(resolve => {
        return resolve({
            currency: giftCard.currency,
            amount: giftCard.initial_balance_amount
        });
    });
}

function getCurrentBalance(giftCard) {
    return new Promise(resolve => {
        return resolve({
            currency: giftCard.currency,
            amount: giftCard.current_balance_amount
        });
    });
}

module.exports = getGraphQLGiftCardById;
const {
    checkAuthorization,
    getGraphQLShippingZoneById,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLUserById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");
const getGraphQLAppById = require('../lib/getGraphQLAppById');

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let giftCardId = parent.id;
        resolve(getGiftCardEvents(args, giftCardId));
    });
}

function getGiftCardEvents(args, giftCardId) {
    return new Promise(async(resolve, reject) => {
        let { values, whereClause } = getGiftCardEventInput(giftCardId, args);
        productQueries.getGiftCardEvents(values, whereClause, result => {
            if (result.err) return reject(JSON.stringify(result.err));
            let giftCardEvents_ = result.res;
            const numGiftCardEvents = giftCardEvents.length;
            let cursor = -1;
            let giftCardEvents = [];

            giftCardEvents_.forEach(ge => {
                productQueries.getGiftCard([ge.id], "id=$1", async result => {
                    if (result.err == null && result.res.length > 0) {
                        let giftCard_ = result.res[0];
                        let user;
                        let app;
                        let email;
                        let tags;
                        try {
                            user = await getGraphQLUserById(giftCard_.user_id);
                            email = user.email;
                        } catch (err) {
                            user = null;
                            email = null;
                        }
                        try {
                            app = await getGraphQLAppById(giftCard_.app_id);
                        } catch (err) {
                            app = null;
                        }
                        try {
                            tags = await getGiftCardTags(giftCard_.id);
                        } catch (err) {
                            tags = null;
                        }
                        giftCardEvents.push({
                            id: ge.id,
                            date: ge.date,
                            type: ge.type,
                            user,
                            app,
                            email,
                            tags,
                            balance: {
                                initialBalance: {
                                    currency: giftCard_.currency,
                                    amount: giftCard_.initial_balance_amount
                                },
                                currentBalance: {
                                    currency: giftCard_.currency,
                                    amount: giftCard_.current_balance_amount
                                }
                            },
                            expiryDate: giftCard_.expiry_date
                        });
                    }

                    checkComplete();
                });
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numGiftCardEvents) {
                    resolve(giftCardEvents);
                }
            }
        });
    });
}

function getGiftCardEventInput(giftCardId, args) {
    let values = [giftCardId];
    let whereClause = "gift_card_id=$1";

    if (args.filter) {
        if (args.filter.type) {
            values.push(args.filter.type);
            whereClause += " AND type=$2";
        }
    }

    return { values, whereClause };
}

function getGiftCardTags(giftCardId) {
    return new Promise((resolve, reject) => {
        productQueries.getGiftCardTags([giftCardId], "giftcard_id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            let giftCardTags = result.res;
            let cursor = -1;
            const numGiftCardTags = giftCardTags.length;
            let tags = [];

            giftCardTags.forEach(tag => {
                productQueries.getGiftCardTag([tag.giftcardtag_id], "id=$1", result => {
                    if (result.err == null && result.res.length > 0) {
                        tags.push(result.res[0].name);
                    }
                    checkComplete();
                });
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numGiftCardTags) {
                    resolve(tags);
                }
            }
        });
    });
}
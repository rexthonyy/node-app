const productQueries = require("../../../postgres/product-queries");
const getGraphQLUserById = require("./getGraphQLUserById");
const getGraphQLChannelById = require("./getGraphQLChannelById");
const getGraphQLAddressById = require("./getGraphQLAddressById");
const getGraphQLShippingMethodById = require("./getGraphQLShippingMethodById");
const getGraphQLWarehouseById = require("./getGraphQLWarehouseById");
const getGraphQLGiftCardById = require("./getGraphQLGiftCardById");
let getGraphQLCheckoutById = (id) => {
    return new Promise((resolve, reject) => {
        productQueries.getCheckout([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                reject(null);
            } else {
                let checkout = result.res[0];
                let user;
                let channel;
                let billingAddress;
                let shippingAddress;
                let shippingMethod;
                let availableCollectionPoints;
                let giftCards;
                let isShippingRequired;

                try {
                    user = await getGraphQLUserById(checkout.user_id);
                } catch (err) {
                    user = null;
                }

                try {
                    channel = await getGraphQLChannelById(checkout.channel_id);
                } catch (err) {
                    channel = null;
                }

                try {
                    billingAddress = await getGraphQLAddressById(checkout.billing_address_id);
                } catch (err) {
                    billingAddress = null;
                }

                try {
                    shippingAddress = await getGraphQLAddressById(checkout.shipping_address_id);
                } catch (err) {
                    shippingAddress = null;
                }

                try {
                    shippingMethod = await getGraphQLShippingMethodById(checkout.shipping_method_id);
                } catch (err) {
                    shippingMethod = null;
                }

                try {
                    availableCollectionPoints = await getGraphQLWarehouseById(checkout.collection_point_id);
                } catch (err) {
                    availableCollectionPoints = null;
                }

                try {
                    giftCards = await getCheckoutGiftCardsByCheckoutToken(checkout.token);
                } catch (err) {
                    giftCards = null;
                }

                resolve({
                    id: checkout.id,
                    privateMetadata: checkout.private_metadata,
                    privateMetafield: JSON.stringify(checkout.private_metadata),
                    privateMetafields: null,
                    metadata: [checkout.metadata],
                    metadatafield: JSON.stringify(checkout.metadata),
                    metadatafields: null,
                    created: checkout.created,
                    lastChange: checkout.last_change,
                    user,
                    channel,
                    billingAddress,
                    shippingAddress,
                    note: checkout.note,
                    discount: {
                        currency: "USD",
                        amount: checkout.discount_amount
                    },
                    discountName: checkout.discount_name,
                    translatedDiscountName: checkout.translated_discount_name,
                    voucherCode: checkout.voucher_code,
                    shippingMethods: [shippingMethod],
                    availableCollectionPoints,
                    availablePaymentGateways: null,
                    email: checkout.email,
                    giftCards,
                    isShippingRequired,
                    quantity: null,
                    stockReservationExpires: null,
                    lines: null,
                    shippingPrice: null,
                    deliveryMethod: null,
                    subtotalPrice: null,
                    token: checkout.token,
                    totalPrice: null,
                    languageCode: checkout.language_code,
                    availableShippingMethods: availableCollectionPoints,
                    shippingMethod
                });
            }
        });
    });
};

function getCheckoutGiftCardsByCheckoutToken(token) {
    return new Promise((resolve, reject) => {
        productQueries.getCheckoutGiftCardsByCheckoutId([token], "checkout_id=$1", result => {
            if (result.err) {
                reject(JSON.stringify(result.err));
            } else {
                let checkoutGiftCards = result.res;
                const numCheckoutGiftCards = checkoutGiftCards.length;
                let cursor = -1;
                let giftCards = [];

                checkoutGiftCards.forEach(async checkoutGiftCard => {
                    giftCards.push(await getGraphQLGiftCardById(checkoutGiftCard.giftcard_id));
                    checkComplete();
                });

                checkComplete();

                function checkComplete() {
                    cursor++;
                    if (cursor == numCheckoutGiftCards) {
                        resolve(giftCards);
                    }
                }
            }
        });
    });
}

module.exports = getGraphQLCheckoutById;
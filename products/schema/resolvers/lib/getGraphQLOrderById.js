const productQueries = require("../../../postgres/product-queries");
const getGraphQLShippingMethodById = require("./getGraphQLShippingMethodById");
const getGraphQLWarehouseById = require("./getGraphQLWarehouseById");
const getGraphQLUserById = require("./getGraphQLUserById");
const getGraphQLAddressById = require("./getGraphQLAddressById");
const getGraphQLChannelById = require("./getGraphQLChannelById");
const getGraphQLOrderFulfillmentById = require("./getGraphQLOrderLineById");
const getGraphQLOrderLineById = require("./getGraphQLOrderLineById");

let getGraphQLOrderById = (id) => {
    return new Promise((resolve, reject) => {
        productQueries.getOrder([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                return reject("Order not found");
            }

            let order = result.res[0];
            let user;
            let billingAddress;
            let shippingAddress;
            let channel;
            let fulfillments;
            let lines;
            let shippingMethod;
            let availableCollectionPoint;
            let invoices;

            try {
                user = await getGraphQLUserById(order.user_id);
            } catch (err) {
                user = null;
            }

            try {
                billingAddress = await getGraphQLAddressById(order.billing_address_id);
            } catch (err) {
                billingAddress = null;
            }

            try {
                shippingAddress = await getGraphQLAddressById(order.shipping_address_id);
            } catch (err) {
                shippingAddress = null;
            }

            try {
                channel = await getGraphQLChannelById(order.channel_id);
            } catch (err) {
                channel = null;
            }

            try {
                fulfillments = await getFullfillmentsByOrderId(order.id);
            } catch (err) {
                fulfillments = null;
            }

            try {
                lines = await getLinesByOrderId(order.id);
            } catch (err) {
                lines = null;
            }

            try {
                shippingMethod = await getGraphQLShippingMethodById(order.shipping_method_id);
            } catch (err) {
                shippingMethod = null;
            }

            try {
                availableCollectionPoint = await getGraphQLWarehouseById(order.collection_point_id);
            } catch (err) {
                availableCollectionPoint = null;
            }

            try {
                invoices = await getInvoicesByOrderId(order.id);
            } catch (err) {
                invoices = null;
            }

            let res = {
                id: order.id,
                privateMetadata: order.private_metadata,
                privateMetafield: JSON.stringify(order.private_metadata),
                privateMetafields: null,
                metadata: order.metadata,
                metadatafield: JSON.stringify(order.metadata),
                metadatafields: null,
                created: order.created,
                updatedAt: order.updated_at,
                status: order.status,
                user,
                trackingClientId: order.tracking_client_id,
                billingAddress,
                shippingAddress,
                shippingMethodName: order.shipping_method_name,
                collectionPointName: order.collection_point_name,
                channel,
                fulfillments,
                lines,
                actions: null,
                shippingMethods: [shippingMethod],
                availableCollectionPoints: [availableCollectionPoint],
                invoices,
                number: "",
                original: order.original_id,
                origin: order.origin,
                isPaid: false,
                paymentStatus: null,
                paymentStatusDisplay: null,
                authorizeStatus: null,
                chargeStatus: null,
                transactions: null,
                payments: null,
                total: null,
                undiscountedTotal: null,
                shippingTaxRate: null,
                voucher: null,
                giftCards: null,
                displayGrossPrices: null,
                customerNote: order.customer_note,
                weight: null,
                redirectUrl: order.redirect_url,
                subtotal: null,
                statusDisplay: null,
                canFinalize: null,
                totalAuthorized: null,
                totalCaptured: null,
                events: null,
                totalBalance: null,
                userEmail: order.user_email,
                isShippingRequired: null,
                deliveryMethod: null,
                languageCodeEnum: order.language_code,
                discounts: null,
                errors: null,
                availableShippingMethods: null,
                shippingMethod: null,
                token: order.token,
                languageCode: order.language_code,
                discount: null,
                discountName: null,
                translatedDiscountName: null
            };

            resolve(res);
        });
    });
};

function getFullfillmentsByOrderId(id) {
    return new Promise((resolve, reject) => {
        productQueries.getOrderFulfillment([id], "order_id=$1", result => {
            if (result.err) {
                console.log("get fulfillments by order id");
                console.log(result.err);
                reject(JSON.stringify(result.err));
            } else {
                let orderFullfillments = result.res;
                const numOrderFulfillment = orderFullfillments.length;
                let cursor = -1;
                let fullfillment = [];

                orderFullfillments.forEach(async orderFulfillment => {
                    fullfillment.push(await getGraphQLOrderFulfillmentById(orderFulfillment.id));
                    checkComplete();
                });

                checkComplete();

                function checkComplete() {
                    cursor++;
                    if (cursor == numOrderFulfillment) {
                        resolve(fullfillment);
                    }
                }
            }
        });
    });
}

function getLinesByOrderId(id) {
    return new Promise((resolve, reject) => {
        productQueries.getOrderLine([id], "order_id=$1", result => {
            if (result.err) {
                console.log("get lines by order id");
                console.log(result.err);
                reject(JSON.stringify(result.err));
            } else {
                let orderLines = result.res;
                const numOrderLines = orderLines.length;
                let cursor = -1;
                let graphQLOrderLines = [];

                orderLines.forEach(async orderLine => {
                    graphQLOrderLines.push(await getGraphQLOrderLineById(orderLine.id));
                    checkComplete();
                });

                checkComplete();

                function checkComplete() {
                    cursor++;
                    if (cursor == numOrderLines) {
                        resolve(graphQLOrderLines);
                    }
                }
            }
        });
    });
}

module.exports = getGraphQLOrderById;
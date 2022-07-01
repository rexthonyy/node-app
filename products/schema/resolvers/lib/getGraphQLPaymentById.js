const productQueries = require("../../../postgres/product-queries");
const getGraphQLCheckoutById = require('./getGraphQLCheckoutById');
const getGraphQLOrderById = require('./getGraphQLOrderById');
const getGraphQLTransactionsByPaymentId = require('./getGraphQLTransactionsByPaymentId');
const getGraphQLSelectedAttributesByProductId = require('./getGraphQLSelectedAttributesByProductId');

let getGraphQLPaymentById = (id) => {
    return new Promise((resolve, reject) => {
        productQueries.getPayment([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                return reject("Payment not found");
            }

            let payment = result.res[0];
            let checkout;
            let order;
            let actions;
            let transactions;

            try {
                checkout = await getGraphQLCheckoutById(payment.checkout_id);
            } catch (err) {
                checkout = null;
            }

            try {
                order = await getGraphQLOrderById(payment.order_id);
            } catch (err) {
                order = null;
            }

            try {
                actions = await getGraphQLSelectedAttributesByProductId(payment.id);
            } catch (err) {
                actions = null;
            }

            try {
                transactions = await getGraphQLTransactionsByPaymentId(payment.id);
            } catch (err) {
                transactions = null;
            }

            let res = {
                id: payment.id,
                privateMetadata: payment.private_metadata,
                privateMetafield: JSON.stringify(payment.private_metadata),
                privateMetafields: null,
                metadata: payment.metadata,
                metadatafield: JSON.stringify(payment.metadata),
                metadatafields: null,
                gateway: payment.gateway,
                isActive: payment.is_active,
                created: payment.created,
                modified: payment.modified,
                token: payment.token,
                checkout,
                order,
                paymentMethodType: payment.payment_method_type,
                customerIpAddress: payment.customer_ip_address,
                chargeStatus: payment.charge_status,
                actions,
                total: payment.total,
                capturedAmount: payment.captured_amount,
                transactions,
                availableCaptureAmount: null,
                availableRefundAmount: null,
                creditCard: {
                    brand: payment.cc_brand,
                    firstDigits: payment.cc_first_digits,
                    lastDigits: payment.cc_last_digits,
                    expMonth: payment.cc_exp_month,
                    expYear: payment.cc_exp_year
                }
            };

            resolve(res);
        });
    });
};

module.exports = getGraphQLPaymentById;
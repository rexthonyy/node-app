const productQueries = require("../../../postgres/product-queries");

let getGraphQLTransactionsByPaymentId = (id) => {
    return new Promise((resolve, reject) => {
        productQueries.getPaymentTransaction([id], "payment_id=$1", async result => {
            if (result.err) {
                return reject("Payment transaction not found");
            }

            let paymentTransactions = result.res;
            const numPaymentTransactions = paymentTransactions.length;
            let cursor = -1;
            let graphQLPaymentTransactions = [];

            paymentTransactions.forEach(transaction => {
                graphQLPaymentTransactions.push({
                    id: transaction.id,
                    created: transaction.created,
                    payment: null,
                    token: transaction.token,
                    kind: transaction.kind,
                    isSuccess: transaction.is_success,
                    error: transaction.error,
                    gatewayResponse: transaction.gateway_response,
                    amount: {
                        currency: transaction.currency,
                        amount: transaction.amount
                    }
                });

                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numPaymentTransactions) {
                    resolve(graphQLPaymentTransactions);
                }
            }
        });
    });
};

module.exports = getGraphQLTransactionsByPaymentId;
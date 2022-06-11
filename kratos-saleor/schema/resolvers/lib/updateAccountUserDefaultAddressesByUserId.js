const pgKratosQueries = require('../../../postgres/kratos-queries');

let updateAccountUserDefaultAddressesByUserId = (user_id) => {
    return new Promise((resolve, reject) => {
        pgKratosQueries.getUserById([user_id], async result => {
            if (result.err || result.res.length == 0) {
                return reject("User not found");
            }

            let accountUser = result.res[0];
            await checkAndUpdateAccountUserDefaultShippingAddress(user_id, accountUser.default_shipping_address_id);
            await checkAndUpdateAccountUserDefaultBillingAddress(user_id, accountUser.default_billing_address_id);
            resolve();
        });
    });
};

function checkAndUpdateAccountUserDefaultShippingAddress(user_id, address_id) {
    return new Promise((resolve) => {
        pgKratosQueries.getAccountAddressById([address_id], result => {
            if (result.err) return resolve();
            if (result.res.length != 0) return resolve();
            pgKratosQueries.updateAccountUserById([user_id, null], "default_shipping_address_id=$2", result => {
                resolve();
            });
        });
    });
}

function checkAndUpdateAccountUserDefaultBillingAddress(user_id, address_id) {
    return new Promise((resolve) => {
        pgKratosQueries.getAccountAddressById([address_id], result => {
            if (result.err) return resolve();
            if (result.res.length != 0) return resolve();
            pgKratosQueries.updateAccountUserById([user_id, null], "default_billing_address_id=$2", result => {
                resolve();
            });
        });
    });
}

module.exports = updateAccountUserDefaultAddressesByUserId;
const pgKratosQueries = require("../../postgres/kratos-queries");

module.exports = async(parent, args, context) => {
    return new Promise((resolve) => {
        if (!context.user) return resolve(getGraphQLOutput("authorization-bearer", "Please enter a valid authorization header", "JWT_INVALID_TOKEN", null, null));
        const authUser = context.user;

        let userIds = args.ids;
        const numIds = userIds.length;
        let idCursor = -1;

        userIds.forEach(userId => {
            pgKratosQueries.getUserById([userId], async result => {
                if (result.err) return checkComplete();
                try {
                    await deleteUserFromAccountUserAddresses(userId);
                    await deleteUserFromAccountUser(userId);
                    checkComplete();
                } catch (err) {
                    checkComplete();
                }
            });
        });

        checkComplete();

        function checkComplete() {
            idCursor++;
            if (idCursor == numIds) {
                resolve(getGraphQLOutput("", "", "INVALID", null, numIds));
            }
        }
    });
}

function getGraphQLOutput(field, message, code, addressType, count) {
    return {
        count,
        errors: [{
            field,
            message,
            code,
            addressType
        }],
        staffErrors: [{
            field,
            message,
            code,
            addressType
        }]
    };
}

function deleteUserFromAccountUserAddresses(user_id) {
    return new Promise((resolve) => {
        pgKratosQueries.getAccountUserAddressesByUserId([user_id], result => {
            if (result.err || result.res.length == 0) return resolve();
            let userAddresses = result.res;
            const numAddresses = userAddresses.length;
            let countAddress = -1;

            userAddresses.forEach(userAddress => {
                pgKratosQueries.deleteAccountAddressById([userAddress.address_id], result => {
                    checkComplete();
                });
            });

            checkComplete();

            function checkComplete() {
                countAddress++;
                if (countAddress == numAddresses) {
                    pgKratosQueries.deleteAccountUserAddressesByUserId([user_id], result => {
                        if (result.err) console.log(result.err);
                        resolve();
                    });
                }
            }
        });

    });
}

function deleteUserFromAccountUser(user_id) {
    return new Promise((resolve) => {
        pgKratosQueries.deleteAccountUserById([user_id], result => {
            if (result.err) console.log(result.err);
            resolve();
        });
    });
}
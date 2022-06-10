const jwt = require('jsonwebtoken');
const pgKratosQueries = require("../../postgres/kratos-queries");
const { getGraphQLUserById } = require("./lib");

module.exports = async(parent, args, context) => {
    return new Promise((resolve) => {
        if (!context.user) return resolve(getError("authorization-bearer", "Please enter a valid authorization header", "JWT_INVALID_TOKEN", null));
        const authUser = context.user;

        let token = args.token;

        jwt.verify(token, process.env.AUTHORIZATION_TOKEN_SECRET, (err, payload) => {
            if (err) return resolve(getError("token", "Invalid token", "JWT_INVALID_TOKEN", null));
            let user_id = payload.sub;
            if (Number(user_id) != authUser.id) return resolve(getError("token", "Invalid user token", "JWT_DECODE_ERROR", null));
            pgKratosQueries.getUserById([user_id], result => {
                if (result.err) return resolve(getError("token", "User not found", "NOT_FOUND", null));
                let accountUser = result.res[0];
                jwt.verify(payload.data, accountUser.jwt_token_key, async(err, user) => {
                    if (err) return resolve(getError("token", "Invalid token", "JWT_DECODE_ERROR", null));

                    try {
                        let graphQLUser = await getGraphQLUserById(Number(user_id));
                        await deleteUserFromAccountUserAddresses(Number(user_id));
                        await deleteUserFromAccountUser(Number(user_id));
                        resolve(getResult(graphQLUser));
                    } catch (err) {
                        return resolve(getError("error", err, "DELETE_OWN_ACCOUNT", null));
                    }
                });
            });
        });
    });
}

function getError(field, message, code, addressType, user) {
    return {
        errors: [{
            field,
            message,
            code,
            addressType
        }],
        accountErrors: [{
            field,
            message,
            code,
            addressType
        }],
        user
    };
}

function getResult(user) {
    return {
        errors: [{
            code: "INVALID"
        }],
        accountErrors: [{
            code: "INVALID"
        }],
        user
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
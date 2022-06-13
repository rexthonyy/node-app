const pgKratosQueries = require("../../postgres/kratos-queries");
const { getGraphQLUserById } = require("./lib");
const userPermissionGroupHasAccess = require("./lib/userPermissionGroupHasAccess");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve) => {
        if (!context.user) return resolve(getGraphQLOutput("authorization-bearer", "Please enter a valid authorization header", "JWT_INVALID_TOKEN", null, null));
        const authUser = context.user;

        if (authUser.userPermissions.find(permission => permission.code == "MANAGE_STAFF")) {
            resolve(await staffDelete(args));
        } else if (userPermissionGroupHasAccess(authUser.permissionGroups, ["MANAGE_STAFF"])) {
            resolve(await staffDelete(args));
        } else {
            resolve(getGraphQLOutput("permission", "You do not have permission to perform this operation. MANAGE_STAFF", "OUT_OF_SCOPE_PERMISSION", null, null, null));
        }
    });
}

function staffDelete(args) {
    return new Promise(resolve => {
        let userId = args.id;

        pgKratosQueries.getUserById([userId], async result => {
            if (result.err) return resolve(getGraphQLOutput("id", "User not found", "NOT_FOUND", null, null));
            try {
                let graphQLUser = await getGraphQLUserById(userId);
                await deleteUserFromAccountUserAddresses(userId);
                await deleteUserFromAccountUser(userId);
                resolve(getGraphQLOutput("", "", "INVALID", null, graphQLUser));
            } catch (err) {
                resolve(getGraphQLOutput("error", err, "INVALID", null, null));
            }
        });
    });
}

function getGraphQLOutput(field, message, code, addressType, user) {
    return {
        user: user,
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
const permissionsdbQueries = require('../../../postgres/permissionsdb-queries');
const pgKratosQueries = require('../../../postgres/kratos-queries');
const getUserPermissions = require('./getUserPermissions');
const getAuthGroupPermissionsByGroupId = require('./getAuthGroupPermissionsByGroupId');

let getUsersInGroupId = (groupId) => {
    return new Promise(resolve => {
        permissionsdbQueries.getAccountUserGroupsByGroupId([groupId], async result => {
            if (result.err || result.res.length == 0) {
                return resolve([]);
            }

            let accountUserGroupRows = result.res;
            let users = [];

            console.log(accountUserGroupRows);
            for (let accountUser of accountUserGroupRows) {
                let graphQLUser = await getGraphQLUserById(Number(accountUser.user_id));
                users.push(graphQLUser);
            }

            resolve(users);
        });
    });
}

function getGraphQLUserById(user_id) {
    return new Promise((resolve, reject) => {
        pgKratosQueries.getUserById([user_id], async result => {
            if (result.err || result.res.length == 0) {
                return reject("User not found");
            }

            let accountUser = result.res[0];
            let addresses = await getAccountUserAddresses(user_id);
            let defaultShippingAddress = getDefaultAddress(accountUser.default_shipping_address_id, addresses);
            let defaultBillingAddress = getDefaultAddress(accountUser.default_billing_address_id, addresses);
            let userPermissions = await getUserPermissions(accountUser.id);
            let permissionGroups = await getUserPermissionGroups(accountUser.id);
            let userType = {
                id: accountUser.id,
                privateMetadata: accountUser.private_metadata,
                privateMetafield: JSON.stringify(accountUser.private_metadata),
                privateMetafields: null,
                metadata: [accountUser.metadata],
                metadatafield: JSON.stringify(accountUser.metadata),
                metadatafields: null,
                email: accountUser.email,
                firstName: accountUser.first_name,
                lastName: accountUser.last_name,
                isStaff: accountUser.is_staff,
                isActive: accountUser.is_active,
                addresses,
                checkoutToken: null,
                giftCards: null,
                note: accountUser.note,
                orders: null,
                userPermissions,
                permissionGroups,
                editableGroups: null,
                avatar: {
                    url: accountUser.avatar,
                    alt: accountUser.avatar
                },
                events: null,
                storedPaymentSources: null,
                languageCode: accountUser.language_code,
                defaultShippingAddress,
                defaultBillingAddress,
                lastLogin: accountUser.last_login,
                dateJoined: accountUser.date_joined,
                updatedAt: accountUser.updated_at
            };

            resolve(userType);
        });
    });
}

function getAccountUserAddresses(user_id) {
    return new Promise((resolve) => {
        pgKratosQueries.getAccountUserAddressesByUserId([user_id], result => {
            if (result.err) return resolve([]);
            let accountUserAddresses = result.res;
            const numAddresses = accountUserAddresses.length;
            let countAddress = -1;
            let addresses = [];

            accountUserAddresses.forEach(userAddress => {
                pgKratosQueries.getAccountAddressById([userAddress.address_id], result => {
                    if (!(result.err || result.res.length == 0)) {
                        let accountAddress = result.res[0];
                        addresses.push({
                            id: accountAddress.id,
                            firstName: accountAddress.first_name,
                            lastName: accountAddress.last_name,
                            companyName: accountAddress.company_name,
                            streetAddress1: accountAddress.street_address_1,
                            streetAddress2: accountAddress.street_address_2,
                            city: accountAddress.city,
                            cityArea: accountAddress.city_area,
                            postalCode: accountAddress.postal_code,
                            country: {
                                code: accountAddress.country,
                                country: accountAddress.country,
                            },
                            countryArea: accountAddress.country_area,
                            phone: accountAddress.phone,
                            isDefaultShippingAddress: false,
                            isDefaultBillingAddress: false
                        });
                    }
                    checkCountAddressComplete();
                });
            });

            checkCountAddressComplete();

            function checkCountAddressComplete() {
                countAddress++;
                if (countAddress == numAddresses) {
                    resolve(addresses);
                }
            }
        });
    });
}

function getDefaultAddress(address_id, addresses) {
    let defaultAddress = null;
    for (let i = 0, j = addresses.length; i < j; i++) {
        let address = addresses[i];
        if (address_id == address.id) {
            defaultAddress = address;
            break;
        }
    }
    return defaultAddress;
}

let getUserPermissionGroups = (userId) => {
    return new Promise(resolve => {
        permissionsdbQueries.getAccountUserGroupsByUserId([userId], result => {
            if (result.err || result.res.length == 0) {
                return resolve([]);
            }

            let accountUserGroupRows = result.res;
            const numRows = accountUserGroupRows.length;
            let countGroups = -1;
            let userPermissionGroups = [];

            accountUserGroupRows.forEach(row => {
                permissionsdbQueries.getAuthGroupById([row.group_id], async result => {
                    if (result.err || result.res.length == 0) {
                        checkPermissionGroupComplete();
                    } else {
                        let authGroup = result.res[0];

                        let permissions = await getAuthGroupPermissionsByGroupId(authGroup.id);
                        let userCanManage = false;

                        for (let i = 0, j = permissions.length; i < j; i++) {
                            if (permissions[i].code == "MANAGE_USERS") {
                                userCanManage = true;
                                break;
                            }
                        }
                        let users = null;

                        userPermissionGroups.push({
                            id: authGroup.id,
                            name: authGroup.name,
                            users,
                            permissions,
                            userCanManage
                        });

                        checkPermissionGroupComplete();
                    }
                });
            });

            checkPermissionGroupComplete();

            function checkPermissionGroupComplete() {
                countGroups++;
                if (countGroups == numRows) {
                    return resolve(userPermissionGroups);
                }
            }
        });
    });
};

module.exports = getUsersInGroupId;
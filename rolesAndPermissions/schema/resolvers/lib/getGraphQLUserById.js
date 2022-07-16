const { formatMetadata } = require('../../../lib/util');
const pgKratosQueries = require('../../../postgres/kratos-queries');
const getUserPermissions = require('./getUserPermissions');
const getUserPermissionGroups = require('./getUserPermissionGroups');

let getGraphQLUserById = user_id => {
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
                privateMetadata: formatMetadata(accountUser.private_metadata),
                metadata: formatMetadata(accountUser.metadata),
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
                    url: accountUser.avatar || "",
                    alt: accountUser.avatar || ""
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
};

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

module.exports = getGraphQLUserById;
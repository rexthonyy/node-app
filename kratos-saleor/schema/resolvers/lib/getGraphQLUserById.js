const pgKratosQueries = require('../../../postgres/kratos-queries');
const schemaHandler = require('../../../identities/schemaHandler');

let getGraphQLUserById = (user_id) => {
    return new Promise((resolve, reject) => {
        pgKratosQueries.getUserById([user_id], async result => {
            if (result.err || result.res.length == 0) {
                return reject("User not found");
            }

            let accountUser = result.res[0];
            let addresses = await getAccountUserAddresses(user_id);
            console.log(accountUser.private_metadata);
            console.log(accountUser.private_metadata.key);
            let userType = {
                id: accountUser.id,
                privateMetadata: [{
                    key: accountUser.private_metadata.key ? accountUser.private_metadata.key : null,
                    value: accountUser.private_metadata.value ? accountUser.private_metadata.value : null
                }],
                privateMetafield: JSON.stringify(accountUser.private_metadata),
                privateMetafields: accountUser.private_metadata,
                metadata: [{
                    key: accountUser.metadata.key ? accountUser.metadata.key : null,
                    value: accountUser.metadata.value ? accountUser.metadata.value : null
                }],
                metadatafield: JSON.stringify(accountUser.metadata),
                metadatafields: accountUser.metadata,
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
                userPermissions: null,
                permissionGroups: null,
                editableGroups: null,
                avatar: {
                    url: accountUser.avatar,
                    alt: accountUser.avatar
                },
                events: null,
                storedPaymentSources: null,
                languageCode: accountUser.language_code,
                defaultShippingAddress: null,
                defaultBillingAddress: null,
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
                pgKratosQueries.getAccountAddressById([userAddress.id], result => {
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
module.exports = getGraphQLUserById;
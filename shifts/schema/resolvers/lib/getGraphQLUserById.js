const pgKratosQueries = require('../../../postgres/kratos-queries');
const getUserPermissions = require('./getUserPermissions');
const getUserPermissionGroups = require('./getUserPermissionGroups');

let getGraphQLUserById = (user_id) => {
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
                    url: formatAvatarOutput(accountUser.avatar),
                    alt: formatAvatarOutput(accountUser.avatar)
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


function formatAvatarOutput(avatar) {
    if (!avatar) return "";
    return `
    resources: [
        {
          id: "dayNote",
          name: "Day Note",
          groupOnly: false,
          render: <p>Abc</p>
        },
        {
          id: "groupOne",
          name: (
            <div className="contentRes">
              <div>Group One</div>
              <IconButton
                style={{
                  maxWidth: "130px",
                  fontSize: "13px",
                  marginTop: "13px"
                }}
                onClick={() => {
                  console.log("This is click");
                }}
              >
                <Group style={{ color: "#665d5d", fontSize: "18px" }} />
                <span
                  style={{ fontSize: "13px", marginLeft: "3px" }}
                >{\`Add People\`}</span>
              </IconButton>
            </div>
          ),
          groupOnly: true,
          render: <p>Abc</p>
        },
        {
          id: "r1",
          name: (
            <div className="containerRes">
              <div className="avatare">RA</div>
              <div className="contentRes">
                <span>{\`Roy alex\`}</span>
                <span className="hrsRes">{\`12 Hrs\`}</span>
              </div>
            </div>
          ),
          author: "X",
          bgColor: "red",
          issue: "#1",
          parentId: "groupOne"
        },
        {
          id: "r2",
          name: (
            <div className="containerRes">
              <img
                src="${avatar}"
                className="avatare"
              />
              <div className="contentRes">
                <span>{\`Alax alex\`}</span>
                <span className="hrsRes">{\`12 Hrs\`}</span>
              </div>
            </div>
          ),
          author: "X",
          bgColor: "red",
          issue: "#1",
          parentId: "groupOne"
        },
        {
          id: "r3",
          name: (
            <div className="containerRes">
              <div className="avatare">RA</div>
              <div className="contentRes">
                <span>{\`Roy alex\`}</span>
                <span className="hrsRes">{\`12 Hrs\`}</span>
              </div>
            </div>
          ),
          author: "X",
          bgColor: "red",
          issue: "#1",
          parentId: "groupOne"
        },
        {
          id: "r4",
          name: (
            <div className="containerRes">
              <img
                src="${avatar}"
                className="avatare"
              />
              <div className="contentRes">
                <span>{\`Alax alex\`}</span>
                <span className="hrsRes">{\`12 Hrs\`}</span>
              </div>
            </div>
          ),
          parentId: "groupOne"
        },
        {
          id: "groupTwo",
          name: (
            <div className="contentRes">
              <div>Group Two</div>
              <IconButton
                style={{
                  maxWidth: "130px",
                  fontSize: "13px",
                  marginTop: "13px"
                }}
                onClick={() => {
                  console.log("This is click");
                }}
              >
                <Group style={{ color: "#665d5d", fontSize: "18px" }} />
                <span
                  style={{ fontSize: "13px", marginLeft: "3px" }}
                >{\`Add People\`}</span>
              </IconButton>
            </div>
          ),
          groupOnly: true,
          render: <p>Abc</p>
        },
        {
          id: "r5",
          name: (
            <div className="containerRes">
              <div className="avatare">MA</div>
              <div className="contentRes">
                <span>{\`MAx alex\`}</span>
                <span className="hrsRes">{\`1 Hrs\`}</span>
              </div>
            </div>
          ),
          parentId: "groupTwo"
        },
        {
          id: "r6",
          name: (
            <div className="containerRes">
              <div className="avatare">TA</div>
              <div className="contentRes">
                <span>{\`Taan alex\`}</span>
                <span className="hrsRes">{\`2 Hrs\`}</span>
              </div>
            </div>
          ),
          parentId: "groupTwo"
        },
        {
          id: "r7",
          name: (
            <div className="containerRes">
              <div className="avatare">AA</div>
              <div className="contentRes">
                <span>{\`Alex alex\`}</span>
                <span className="hrsRes">{\`120 Hrs\`}</span>
              </div>
            </div>
          ),
          parentId: "groupTwo"
        },
        {
          id: "r8",
          name: (
            <div className="containerRes">
              <div className="avatare">AA</div>
              <div className="contentRes">
                <span>{\`Alex alex\`}</span>
                <span className="hrsRes">{\`120 Hrs\`}</span>
              </div>
            </div>
          ),
          parentId: "groupTwo"
        }
      ],
    `;
}
module.exports = getGraphQLUserById;
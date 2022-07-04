const {
    checkAuthorization,
    getGraphQLShippingZoneById,
    userPermissionGroupHasAccess,
    userHasAccess
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return reject(message);

        let accessPermissions = ["MANAGE_SHIPPING"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(getShippingZones(args));
        } else {
            reject("You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_SHIPPING");
        }
    });
}


function getShippingZones(args) {
    return new Promise(async(resolve, reject) => {
        try {
            let edges = await getAllShippingZones();
            resolve({
                pageInfo: {
                    hasNextPage: false,
                    hasPreviousPage: false,
                    startCursor: "",
                    endCursor: ""
                },
                edges,
                totalCount: edges.length
            });
        } catch (err) {
            reject(err);
        }
    });
}

function getAllShippingZones() {
    return new Promise((resolve, reject) => {
        productQueries.getShippingZone([-1], "id <> $1", result => {
            if (result.err) { return reject(JSON.stringify(result.err)); }
            let shippingZones = result.res;

            const numShippingZones = shippingZones.length;
            let cursor = -1;
            let edges = [];

            shippingZones.forEach(async shippingZone => {
                let node = await getGraphQLShippingZoneById(shippingZone.id);
                edges.push({
                    cursor: "",
                    node
                });

                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numShippingZones) {
                    resolve(edges);
                }
            }
        });
    })
}
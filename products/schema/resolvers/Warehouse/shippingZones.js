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

        console.log(warehouseId);
        let warehouseId = parent.id;
        resolve(getShippingZones(args, warehouseId));
    });
}


function getShippingZones(args, warehouseId) {
    return new Promise(async(resolve, reject) => {
        try {
            let edges = await getAllShippingZones(warehouseId);
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

function getAllShippingZones(warehouseId) {
    return new Promise((resolve, reject) => {
        productQueries.getWarehouseShippingZones([warehouseId], "warehouse_id=$1", result => {
            if (result.err) { return reject(JSON.stringify(result.err)); }
            let warehouseShippingZones = result.res;
            const numWarehouseShippingZones = warehouseShippingZones.length;
            let cursor = -1;

            let edges = [];

            warehouseShippingZones.forEach(async shippingZone => {
                let node = await getGraphQLShippingZoneById(shippingZone.shippingzone_id);
                edges.push({
                    cursor: "",
                    node
                });

                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numWarehouseShippingZones) {
                    resolve(edges);
                }
            }
        });
    })
}
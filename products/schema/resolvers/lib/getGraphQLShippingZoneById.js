const productQueries = require("../../../postgres/product-queries");
const getGraphQLChannelById = require("./getGraphQLChannelById");
const getGraphQLShippingMethodById = require("./getGraphQLShippingMethodById");
const getGraphQLWarehouseById = require("./getGraphQLWarehouseById");
let getGraphQLShippingZoneById = (id) => {
    return new Promise((resolve, reject) => {
        productQueries.getShippingZone([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                reject(null);
            } else {
                let shippingZone = result.res[0];
                let shippingMethods;
                let warehouses;
                let channels;

                try {
                    shippingMethods = await getShippingMethodsByShippingZoneId(id);
                } catch (err) {
                    shippingMethods = null;
                }

                try {
                    warehouses = await getWarehousesByShippingZoneId(id);
                } catch (err) {
                    warehouses = null;
                }

                try {
                    channels = await getChannelsByShippingZoneId(id);
                } catch (err) {
                    channels = null;
                }

                let res = {
                    id: shippingZone.id,
                    privateMetadata: shippingZone.private_metadata,
                    privateMetafield: JSON.stringify(shippingZone.private_metadata),
                    privateMetafields: null,
                    metadata: shippingZone.metadata,
                    metadatafield: JSON.stringify(shippingZone.metadata),
                    metadatafields: null,
                    name: shippingZone.name,
                    default: shippingZone.default,
                    priceRange: {
                        start: 0,
                        stop: 0
                    },
                    countries: [{
                        code: shippingZone.country,
                        country: shippingZone.country,
                    }],
                    shippingMethods,
                    warehouses,
                    channels,
                    description: shippingZone.description
                };

                resolve(res);
            }
        });
    });
};


function getShippingMethodsByShippingZoneId(id) {
    return new Promise((resolve, reject) => {
        productQueries.getShippingMethod([id], "shipping_zone_id=$1", result => {
            if (result.err || result.res.length == 0) {
                reject("Shipping method not found");
            } else {
                let shippingMethods = result.res[0];
                const numShippingMethods = shippingMethods.length;
                let cursor = -1;
                let graphqlShippingMethods = [];

                shippingMethods.forEach(async shippingMethod => {
                    graphqlShippingMethods.push(await getGraphQLShippingMethodById(shippingMethod.id));
                    checkComplete();
                });

                checkComplete();

                function checkComplete() {
                    cursor++;
                    if (cursor == numShippingMethods) {
                        resolve(graphqlShippingMethods);
                    }
                }
            }
        });
    });
}

function getWarehousesByShippingZoneId(id) {
    return new Promise((resolve, reject) => {
        productQueries.getWarehouseShippingZones([id], "shippingzone_id=$1", result => {
            if (result.err) {
                reject(JSON.stringify(result.err));
            } else {
                let warehouseShippingzones = result.res[0];
                const numWarehouseShippingZones = warehouseShippingzones.length;
                let cursor = -1;
                let graphqlWarehouse = [];

                warehouseShippingzones.forEach(async warehouseshippingzone => {
                    graphqlWarehouse.push(await getGraphQLWarehouseById(warehouseshippingzone.warehouse_id));
                    checkComplete();
                });

                checkComplete();

                function checkComplete() {
                    cursor++;
                    if (cursor == numWarehouseShippingZones) {
                        resolve(graphqlWarehouse);
                    }
                }
            }
        });
    });
}

function getChannelsByShippingZoneId(id) {
    return new Promise((resolve, reject) => {
        productQueries.getShippingZoneChannel([id], "shippingzone_id=$1", result => {
            if (result.err) {
                reject(JSON.stringify(result.err));
            } else {
                let shippingZoneChannels = result.res[0];
                const numShippingZoneChannel = shippingZoneChannels.length;
                let cursor = -1;
                let graphqlChannels = [];

                shippingZoneChannels.forEach(async shippingzonechannel => {
                    graphqlChannels.push(await getGraphQLChannelById(shippingzonechannel.channel_id));
                    checkComplete();
                });

                checkComplete();

                function checkComplete() {
                    cursor++;
                    if (cursor == numShippingZoneChannel) {
                        resolve(graphqlChannels);
                    }
                }
            }
        });
    });
}

module.exports = getGraphQLShippingZoneById;
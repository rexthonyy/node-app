const { formatMetadata } = require("../../../libs/util");
const productQueries = require("../../../postgres/product-queries");
const getGraphQLChannelById = require("./getGraphQLChannelById");
const getGraphQLShippingMethodTypeById = require("./getGraphQLShippingMethodTypeById");
const getGraphQLWarehouseById = require("./getGraphQLWarehouseById");
let getGraphQLShippingZoneById = (id) => {
    return new Promise((resolve, reject) => {
        productQueries.getShippingZone([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                reject("Shipping zone not found");
            } else {
                let shippingZone = result.res[0];
                let shippingMethods;
                let shippingMethodChannelListing;
                let warehouses;
                let channels;

                try {
                    shippingMethods = await getShippingMethodTypesByShippingZoneId(id);
                    shippingMethodChannelListing = shippingMethods.length > 0 ? shippingMethods[0] : null;
                } catch (err) {
                    shippingMethods = null;
                    shippingMethodChannelListing = null;
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
                    privateMetadata: formatMetadata(shippingZone.private_metadata),
                    metadata: formatMetadata(shippingZone.metadata),
                    name: shippingZone.name,
                    default: shippingZone.default,
                    priceRange: {
                        start: shippingMethodChannelListing ? shippingMethodChannelListing.maximumOrderPrice : null,
                        stop: shippingMethodChannelListing ? shippingMethodChannelListing.minimumOrderPrice : null
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


function getShippingMethodTypesByShippingZoneId(id) {
    return new Promise((resolve, reject) => {
        productQueries.getShippingMethod([id], "shipping_zone_id=$1", result => {
            if (result.err) {
                reject(JSON.stringify(result.err));
            } else {
                let shippingMethods = result.res;
                const numShippingMethods = shippingMethods.length;
                let cursor = -1;
                let graphqlShippingMethods = [];

                shippingMethods.forEach(async shippingMethod => {
                    graphqlShippingMethods.push(await getGraphQLShippingMethodTypeById(shippingMethod.id));
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
                let warehouseShippingzones = result.res;
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
                let shippingZoneChannels = result.res;
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
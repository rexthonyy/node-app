const metafield = require('./metafield');
const metafields = require('./metafields');
const privateMetafield = require('./privateMetafield');
const privateMetafields = require('./privateMetafields');
const shippingZones = require('./shippingZones');

module.exports = {
    warehouseMetafield: metafield,
    warehouseMetafields: metafields,
    warehousePrivateMetafield: privateMetafield,
    warehousePrivateMetafields: privateMetafields,
    warehouseShippingZones: shippingZones,
};
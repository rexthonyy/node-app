const metafield = require('./metafield');
const metafields = require('./metafields');
const privateMetafield = require('./privateMetafield');
const privateMetafields = require('./privateMetafields');

module.exports = {
    shippingZoneMetafield: metafield,
    shippingZoneMetafields: metafields,
    shippingZonePrivateMetafield: privateMetafield,
    shippingZonePrivateMetafields: privateMetafields,
};
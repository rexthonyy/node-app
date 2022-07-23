const metafield = require('./metafield');
const metafields = require('./metafields');
const privateMetafield = require('./privateMetafield');
const privateMetafields = require('./privateMetafields');
const events = require('./events');

module.exports = {
    giftCardMetafield: metafield,
    giftCardMetafields: metafields,
    giftCardPrivateMetafield: privateMetafield,
    giftCardPrivateMetafields: privateMetafields,
    giftCardEvents: events,
};
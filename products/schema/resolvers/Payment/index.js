const metafield = require('./metafield');
const metafields = require('./metafields');
const privateMetafield = require('./privateMetafield');
const privateMetafields = require('./privateMetafields');

module.exports = {
    paymentMetafield: metafield,
    paymentMetafields: metafields,
    paymentPrivateMetafield: privateMetafield,
    paymentPrivateMetafields: privateMetafields,
};
const metafield = require('./metafield');
const metafields = require('./metafields');
const privateMetafield = require('./privateMetafield');
const privateMetafields = require('./privateMetafields');
const availableAttributes = require('./availableAttributes');

module.exports = {
    pageTypeMetafield: metafield,
    pageTypeMetafields: metafields,
    pageTypePrivateMetafield: privateMetafield,
    pageTypePrivateMetafields: privateMetafields,
    pageTypeAvailableAttributes: availableAttributes,
};
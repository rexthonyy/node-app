const metafield = require('./metafield');
const metafields = require('./metafields');
const privateMetafield = require('./privateMetafield');
const privateMetafields = require('./privateMetafields');

module.exports = {
    userMetafield: metafield,
    userMetafields: metafields,
    userPrivateMetafield: privateMetafield,
    userPrivateMetafields: privateMetafields,
};
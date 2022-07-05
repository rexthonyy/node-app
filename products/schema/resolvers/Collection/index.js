const metafield = require('./metafield');
const metafields = require('./metafields');
const privateMetafield = require('./privateMetafield');
const privateMetafields = require('./privateMetafields');
const translation = require('./translation');

module.exports = {
    collectionMetafield: metafield,
    collectionMetafields: metafields,
    collectionPrivateMetafield: privateMetafield,
    collectionPrivateMetafields: privateMetafields,
    collectionTranslation: translation,
};
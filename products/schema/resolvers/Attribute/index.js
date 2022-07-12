const metafield = require('./metafield');
const metafields = require('./metafields');
const privateMetafield = require('./privateMetafield');
const privateMetafields = require('./privateMetafields');
const translation = require('./translation');

module.exports = {
    attributeMetafield: metafield,
    attributeMetafields: metafields,
    attributePrivateMetafield: privateMetafield,
    attributePrivateMetafields: privateMetafields,
    attributeTranslation: translation,
};
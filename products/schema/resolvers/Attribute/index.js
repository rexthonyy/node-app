const metafield = require('./metafield');
const metafields = require('./metafields');
const privateMetafield = require('./privateMetafield');
const privateMetafields = require('./privateMetafields');
const translation = require('./translation');
const choices = require('./choices');
const productTypes = require('./productTypes');
const productVariantTypes = require('./productVariantTypes');

module.exports = {
    attributeMetafield: metafield,
    attributeMetafields: metafields,
    attributePrivateMetafield: privateMetafield,
    attributePrivateMetafields: privateMetafields,
    attributeTranslation: translation,
    attributeChoices: choices,
    attributeProductTypes: productTypes,
    attributeProductVariantTypes: productVariantTypes,
};
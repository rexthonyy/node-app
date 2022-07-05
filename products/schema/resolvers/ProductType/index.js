const metafield = require('./metafield');
const metafields = require('./metafields');
const privateMetafield = require('./privateMetafield');
const privateMetafields = require('./privateMetafields');
const assignedVariantAttributes = require('./assignedVariantAttributes');

module.exports = {
    productTypeMetafield: metafield,
    productTypeMetafields: metafields,
    productTypePrivateMetafield: privateMetafield,
    productTypePrivateMetafields: privateMetafields,
    productTypeAssignedVariantAttributes: assignedVariantAttributes,
};
const metafield = require('./metafield');
const metafields = require('./metafields');
const privateMetafield = require('./privateMetafield');
const privateMetafields = require('./privateMetafields');
const mediaById = require('./mediaById');
const translation = require('./translation');
const thumbnail = require('./thumbnail');
const pricing = require('./pricing');
const isAvailable = require('./isAvailable');

module.exports = {
    productMetafield: metafield,
    productMetafields: metafields,
    productPrivateMetafield: privateMetafield,
    productPrivateMetafields: privateMetafields,
    productMediaById: mediaById,
    productTranslation: translation,
    productThumbnail: thumbnail,
    productPricing: pricing,
    productIsAvailable: isAvailable,
};
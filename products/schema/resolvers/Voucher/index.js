const metafield = require('./metafield');
const metafields = require('./metafields');
const privateMetafield = require('./privateMetafield');
const privateMetafields = require('./privateMetafields');
const categories = require('./categories');
const collections = require('./collections');
const products = require('./products');
const variants = require('./variants');
const translation = require('./translation');

module.exports = {
    voucherMetafield: metafield,
    voucherMetafields: metafields,
    voucherPrivateMetafield: privateMetafield,
    voucherPrivateMetafields: privateMetafields,
    voucherCategories: categories,
    voucherCollections: collections,
    voucherProducts: products,
    voucherVariants: variants,
    voucherTranslation: translation,
};
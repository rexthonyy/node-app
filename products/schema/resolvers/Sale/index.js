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
    saleMetafield: metafield,
    saleMetafields: metafields,
    salePrivateMetafield: privateMetafield,
    salePrivateMetafields: privateMetafields,
    saleCategories: categories,
    saleCollections: collections,
    saleProducts: products,
    saleVariants: variants,
    saleTranslation: translation,
};
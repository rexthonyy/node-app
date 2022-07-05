const metafield = require('./metafield');
const metafields = require('./metafields');
const privateMetafield = require('./privateMetafield');
const privateMetafields = require('./privateMetafields');
const pricing = require('./pricing');
const attributes = require('./attributes');
const revenue = require('./revenue');
const stocks = require('./stocks');
const quantityAvailable = require('./quantityAvailable');
const translation = require('./translation');

module.exports = {
    productVariantMetafield: metafield,
    productVariantMetafields: metafields,
    productVariantPrivateMetafield: privateMetafield,
    productVariantPrivateMetafields: privateMetafields,
    productVariantPricing: pricing,
    productVariantAttributes: attributes,
    productVariantRevenue: revenue,
    productVariantStocks: stocks,
    productVariantQuantityAvailable: quantityAvailable,
    productVariantTranslation: translation,
};
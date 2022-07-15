const getGraphQLUserById = require('./getGraphQLUserById');
const getGraphQLProductById = require('./getGraphQLProductById');
const getGraphQLProductVariantById = require('./getGraphQLProductVariantById');
const getGraphQLPaymentById = require('./getGraphQLPaymentById');
const getGraphQLWarehouseById = require('./getGraphQLWarehouseById');
const getGraphQLStockById = require('./getGraphQLStockById');
const getGraphQLShippingZoneById = require('./getGraphQLShippingZoneById');
const getGraphQLDigitalContentById = require('./getGraphQLDigitalContentById');
const getGraphQLCategoryById = require('./getGraphQLCategoryById');
const getGraphQLCollectionById = require('./getGraphQLCollectionById');
const getGraphQLCollectionTranslationById = require('./getGraphQLCollectionTranslationById');
const getGraphQLProductTranslationById = require('./getGraphQLProductTranslationById');
const getGraphQLProductTypeById = require('./getGraphQLProductTypeById');
const getGraphQLProductVariantTranslationById = require('./getGraphQLProductVariantTranslationById');
const getGraphQLSelectedAttributeByProductVariantId = require('./getGraphQLSelectedAttributeByProductVariantId');
const getGraphQLAttributeById = require('./getGraphQLAttributeById');
const getGraphQLMenuItemById = require('./getGraphQLMenuItemById');
const getGraphQLPageById = require('./getGraphQLPageById');
const getGraphQLSaleById = require('./getGraphQLSaleById');
const getGraphQLShippingMethodById = require('./getGraphQLShippingMethodById');
const getGraphQLShippingMethodTypeById = require('./getGraphQLShippingMethodTypeById');
const getGraphQLVoucherById = require('./getGraphQLVoucherById');
const getGraphQLAttributeValueById = require('./getGraphQLAttributeValueById');
const checkAuthorization = require('./checkAuthorization');
const { userPermissionGroupHasAccess, userHasAccess } = require('./checkUserHasAccess');

module.exports = {
    getGraphQLUserById,
    getGraphQLProductById,
    getGraphQLProductVariantById,
    getGraphQLPaymentById,
    getGraphQLWarehouseById,
    getGraphQLStockById,
    getGraphQLShippingZoneById,
    getGraphQLDigitalContentById,
    getGraphQLCategoryById,
    getGraphQLCollectionById,
    getGraphQLCollectionTranslationById,
    getGraphQLProductTranslationById,
    getGraphQLProductTypeById,
    getGraphQLProductVariantTranslationById,
    getGraphQLSelectedAttributeByProductVariantId,
    getGraphQLAttributeById,
    getGraphQLMenuItemById,
    getGraphQLPageById,
    getGraphQLSaleById,
    getGraphQLShippingMethodById,
    getGraphQLShippingMethodTypeById,
    getGraphQLVoucherById,
    getGraphQLAttributeValueById,
    checkAuthorization,
    userHasAccess,
    userPermissionGroupHasAccess
};
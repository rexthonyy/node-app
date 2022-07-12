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
    checkAuthorization,
    userHasAccess,
    userPermissionGroupHasAccess
};
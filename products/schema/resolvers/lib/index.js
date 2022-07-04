const getGraphQLUserById = require('./getGraphQLUserById');
const getGraphQLProductById = require('./getGraphQLProductById');
const getGraphQLProductVariantById = require('./getGraphQLProductVariantById');
const getGraphQLPaymentById = require('./getGraphQLPaymentById');
const getGraphQLWarehouseById = require('./getGraphQLWarehouseById');
const getGraphQLStockById = require('./getGraphQLStockById');
const getGraphQLShippingZoneById = require('./getGraphQLShippingZoneById');
const getGraphQLDigitalContentById = require('./getGraphQLDigitalContentById');
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
    checkAuthorization,
    userHasAccess,
    userPermissionGroupHasAccess
};
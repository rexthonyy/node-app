const getGraphQLUserById = require('./getGraphQLUserById');
const getGraphQLProductById = require('./getGraphQLProductById');
const getGraphQLProductVariantById = require('./getGraphQLProductVariantById');
const getGraphQLPaymentById = require('./getGraphQLPaymentById');
const getGraphQLWarehouseById = require('./getGraphQLWarehouseById');
const checkAuthorization = require('./checkAuthorization');
const { userPermissionGroupHasAccess, userHasAccess } = require('./checkUserHasAccess');

module.exports = {
    getGraphQLUserById,
    getGraphQLProductById,
    getGraphQLProductVariantById,
    getGraphQLPaymentById,
    getGraphQLWarehouseById,
    checkAuthorization,
    userHasAccess,
    userPermissionGroupHasAccess
};
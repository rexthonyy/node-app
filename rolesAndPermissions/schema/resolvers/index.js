const permissionGroup = require("../resolvers/permissionGroup");
const permissionGroups = require("../resolvers/permissionGroups");
const permissionGroupCreate = require("../resolvers/permissionGroupCreate");
const permissionGroupUpdate = require("../resolvers/permissionGroupUpdate");
const permissionGroupDelete = require("../resolvers/permissionGroupDelete");

module.exports = {
    Query: {
        permissionGroup,
        permissionGroups
    },
    Mutation: {
        permissionGroupCreate,
        permissionGroupUpdate,
        permissionGroupDelete
    }
};
const permissionGroup = require("./permissionGroup");
const permissionGroups = require("./permissionGroups");
const permissionGroupCreate = require("./permissionGroupCreate");
const permissionGroupUpdate = require("./permissionGroupUpdate");
const permissionGroupDelete = require("./permissionGroupDelete");

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
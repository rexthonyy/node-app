const {
    GraphQLNonNull,
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} = require("graphql");

// data types
const GroupCountableConnection = require("./GroupCountableConnection");
const PermissionGroupFilterInput = require("./PermissionGroupFilterInput");

// resolvers
const getPermissionGroupsResolver = require("../resolvers/getPermissionGroupsResolver");

module.exports = new GraphQLObjectType({
    name: "Query",
    description: 'Root Query',
    fields: () => ({
        ping: {
            type: GraphQLString,
            resolve: () => "pong"
        },
        permissionGroups_: {
            type: GraphQLList(GroupCountableConnection),
            description: "List of permission groups. Requires one of the following permissions: MANAGE_STAFF.",
            args: {
                permissionGroupFilterInput: { type: PermissionGroupFilterInput, description: "Filtering options for permission groups." }
            },
            resolve: getPermissionGroupsResolver
        },
    })
});

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLNonNull
} = require("graphql");


// data types
const V1CheckPermissionResponse = require("./V1CheckPermissionResponse");
const V1CheckPermissionRequestInput = require("./V1CheckPermissionRequestInput");


// resolvers
const executeV1CheckPermissionResponseResolver = require("../resolvers/executeV1CheckPermissionResponseResolver");

module.exports = new GraphQLObjectType({
    name: "Mutation",
    description: 'Root Mutation',
    fields: () => ({
        ping: {
            type: GraphQLString,
            resolve: () => "pong"
        },
        permissionsServiceCheckPermission_: {
            type: V1CheckPermissionResponse,
            description: "CheckPermission checks whether a subject has a particular permission or is a member of a particular relation, on a given resource.\n\nEquivalent to POST /v1/permissions/check",
            args: {
                v1CheckPermissionRequestInput: { type: GraphQLNonNull(V1CheckPermissionRequestInput), description: "CheckPermissionRequest issues a check on whether a subject has a permission or is a member of a relation, on a specific resource." }
            },
            resolve: executeV1CheckPermissionResponseResolver
        },
    })
});

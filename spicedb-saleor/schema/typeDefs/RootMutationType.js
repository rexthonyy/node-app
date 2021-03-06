const {
    GraphQLObjectType,
    GraphQLList,
    GraphQLString,
    GraphQLNonNull
} = require("graphql");


// data types
const V1CheckPermissionResponse = require("./V1CheckPermissionResponse");
const V1CheckPermissionRequestInput = require("./V1CheckPermissionRequestInput");
const V1DeleteRelationshipsResponse = require("./V1DeleteRelationshipsResponse");
const V1DeleteRelationshipsRequestInput = require("./V1DeleteRelationshipsRequestInput");
const StreamResultOfV1LookupResourcesResponse = require("./StreamResultOfV1LookupResourcesResponse");
const V1LookupResourcesRequestInput = require("./V1LookupResourcesRequestInput");
const V1Relationship = require("./V1Relationship");
const V1ReadRelationshipsRequestInput = require("./V1ReadRelationshipsRequestInput");
const V1WriteRelationshipsResponse = require("./V1WriteRelationshipsResponse");
const V1WriteRelationshipsRequestInput = require("./V1WriteRelationshipsRequestInput");


// resolvers
const executeV1CheckPermissionResponseResolver = require("../resolvers/executeV1CheckPermissionResponseResolver");
const executeV1DeleteRelationshipsResponseResolver = require("../resolvers/executeV1DeleteRelationshipsResponseResolver");
const executeStreamResultOfV1LookupResourcesResponseResolver = require("../resolvers/executeStreamResultOfV1LookupResourcesResponseResolver");
const executePermissionsServiceReadRelationshipsResolver = require("../resolvers/executePermissionsServiceReadRelationshipsResolver");
const executePermissionsServiceWriteRelationshipsResolver = require("../resolvers/executePermissionsServiceWriteRelationshipsResolver");

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
        permissionsServiceDeleteRelationships_: {
            type: V1DeleteRelationshipsResponse,
            description: "DeleteRelationships deletes relationships matching one or more filters, in bulk.\n\nEquivalent to POST /v1/relationships/delete",
            args: {
                v1DeleteRelationshipsRequestInput: { type: GraphQLNonNull(V1DeleteRelationshipsRequestInput), description: "CheckPermissionRequest issues a check on whether a subject has a permission or is a member of a relation, on a specific resource." }
            },
            resolve: executeV1DeleteRelationshipsResponseResolver
        },
        permissionsServiceLookupResources_: {
            type: GraphQLList(StreamResultOfV1LookupResourcesResponse),
            description: "LookupResources returns the IDs of all resources on which the specified subject has permission or on which the specified subject is a member of the relation.\n\nEquivalent to POST /v1/permissions/resources",
            args: {
                v1LookupResourcesRequestInput: { type: GraphQLNonNull(V1LookupResourcesRequestInput) }
            },
            resolve: executeStreamResultOfV1LookupResourcesResponseResolver
        },
        permissionsServiceReadRelationships_: {
            type: GraphQLList(V1Relationship),
            description: "ReadRelationships reads a set of the relationships matching one or more filters.\n\nEquivalent to POST /v1/relationships/read",
            args: {
                v1ReadRelationshipsRequestInput: { type: GraphQLNonNull(V1ReadRelationshipsRequestInput) }
            },
            resolve: executePermissionsServiceReadRelationshipsResolver
        },
        permissionsServiceWriteRelationships_: {
            type:  V1WriteRelationshipsResponse,
            description: "WriteRelationships writes and/or deletes a set of specified relationships, with an optional set of precondition relationships that must exist before the operation can commit.\n\nEquivalent to POST /v1/relationships/write",
            args: {
                v1WriteRelationshipsRequestInput: { type: GraphQLNonNull(V1WriteRelationshipsRequestInput) }
            },
            resolve: executePermissionsServiceWriteRelationshipsResolver
        },
    })
});

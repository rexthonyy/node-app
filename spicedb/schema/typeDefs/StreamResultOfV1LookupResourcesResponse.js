const {
    GraphQLObjectType,
} = require("graphql");

const RpcStatus = require("./RpcStatus");
const V1LookupResourcesResponse = require("./V1LookupResourcesResponse");

module.exports = new GraphQLObjectType({
    name: "StreamResultOfV1LookupResourcesResponse_",
    fields: () => ({
            error: { type: RpcStatus },
            result: { type: V1LookupResourcesResponse, description: "LookupResourcesResponse contains a single matching resource object ID for the requested object type, permission, and subject." }
    })
});
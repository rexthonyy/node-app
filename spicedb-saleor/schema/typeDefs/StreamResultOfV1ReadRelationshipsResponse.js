const {
    GraphQLString,
    GraphQLObjectType,
} = require("graphql");

const RpcStatus = require("./RpcStatus");
const V1ReadRelationshipsResponse = require("./V1ReadRelationshipsResponse");

module.exports = new GraphQLObjectType({
    name: "StreamResultOfV1ReadRelationshipsResponse_",
    fields: () => ({
        error: { type: RpcStatus },
        result: { type: V1ReadRelationshipsResponse, description: "ReadRelationshipsResponse contains a Relationship found that matches the specified relationship filter(s). A instance of this response message will be streamed to the client for each relationship found." }
    })
});
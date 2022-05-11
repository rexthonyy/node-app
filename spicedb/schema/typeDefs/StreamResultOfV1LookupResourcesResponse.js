const {
    GraphQLObjectType,
} = require("graphql");

const RpcStatus = require("./RpcStatus");
const V1LookupResourcesResponse = require("./V1LookupResourcesResponse");

module.exports = new GraphQLObjectType({
    name: "StreamResultOfV1LookupResourcesResponse_",
    fields: () => ({
        objectId: { type: GraphQLString }
    })
});
const {
    GraphQLString,
    GraphQLInputObjectType,
} = require("graphql");

module.exports = new GraphQLInputObjectType({
    name: "StreamResultOfV1ReadRelationshipsResponse_",
    description: "",
    fields: () => ({
        error: { type: RpcStatus }
    })
});
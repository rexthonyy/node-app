const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} = require("graphql");

const V1ZedToken = require("./V1ZedToken");

module.exports = new GraphQLObjectType({
    name: "V1LookupResourcesResponse_",
    description: "LookupResourcesResponse contains a single matching resource object ID for the requested object type, permission, and subject.",
    fields: () => ({
            resourceObjectId: { type: GraphQLList(GraphQLString) }
    })
});
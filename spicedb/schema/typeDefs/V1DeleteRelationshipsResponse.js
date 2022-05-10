const {
    GraphQLString,
    GraphQLObjectType,
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "V1DeleteRelationshipsResponse_",
    fields: () => ({
            status: { type: GraphQLString }
    })
});
const {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "KnowledgeBaseLevelStatusDataType",
    description: "An object that describes the status of a single category or article",
    fields: () => ({
            tooltip: { type: GraphQLString },
            color: { type: GraphQLString },
            count: { type: GraphQLInt }    })
});
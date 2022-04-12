const {
    GraphQLObjectType, GraphQLNonNull, GraphQLInt
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "KnowledgeBaseCategoryStatType",
    description: "This returns an object that provides the stats for a category",
    fields: () => ({
        level: { type: GraphQLNonNull(GraphQLInt)},
        num_categories: { type: GraphQLNonNull(GraphQLInt)},
        num_articles: { type: GraphQLNonNull(GraphQLInt)}
    })
});
const {
    GraphQLObjectType,
    GraphQLInt,
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "KnowledgeBaseCategoryLevelType",
    description: "Returns the level and depth of a knowledge base category",
    fields: () => ({
        level: { type: GraphQLInt},
        depth: { type: GraphQLInt },
        max_level: { type: GraphQLInt }
    })
});
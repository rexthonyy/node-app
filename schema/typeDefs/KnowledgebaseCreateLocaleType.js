const {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLBoolean
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "KnowledgebaseCreateLocale",
    description: "An object which is used when creating a knowledge base",
    fields: () => ({
            id: { type: GraphQLNonNull(GraphQLInt)},
            default: { type: GraphQLBoolean }
    })
});
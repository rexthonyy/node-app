const {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLID
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "KnowledgebaseCreateLocale",
    description: "An object which is used when creating a knowledge base",
    fields: () => ({
            id: { type: GraphQLNonNull(GraphQLID)},
            default: { type: GraphQLBoolean }
    })
});
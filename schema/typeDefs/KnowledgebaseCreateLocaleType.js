const {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLID,
    GraphQLInputObjectType
} = require("graphql");

module.exports = new GraphQLInputObjectType({
    name: "KnowledgebaseCreateLocale",
    description: "An object which is used when creating a knowledge base",
    fields: () => ({
            id: { type: GraphQLNonNull(GraphQLID)},
            default: { type: GraphQLBoolean }
    })
});
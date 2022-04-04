const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLID
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "KnowledgebaseTranslationStatusColor",
    description: "This holds the status color for the translations of a knowledge base category",
    fields: () => ({
            kb_locale_id: { type: GraphQLNonNull(GraphQLID)},
            knowledge_base_translation_id: { type: GraphQLNonNull(GraphQLID) },
            ui_color: { type: GraphQLString },
            tooltip: { type: GraphQLString },
            title: { type: GraphQLString },
            default: { type: GraphQLBoolean }
    })
});
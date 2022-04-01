const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLID
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "Knowledgebase translations",
    description: "This holds the translations for a knowledge base",
    fields: () => ({
            id: { type: GraphQLNonNull(GraphQLID)},
            knowledge_base_id: { type: GraphQLID },
            title: { type: GraphQLString },
            created_at: { type: GraphQLString },
            updated_at: { type: GraphQLString },
            footer_note: { type: GraphQLString },
            kb_locale_id: { type: GraphQLID },
            active: { type: GraphQLBoolean },
            position: { type: GraphQLInt },
            ui_color: { type: GraphQLString },
            is_archived: { type: GraphQLBoolean }
    })
});
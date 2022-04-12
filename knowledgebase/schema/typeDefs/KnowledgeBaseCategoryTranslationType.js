const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLID,
    GraphQLBoolean
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "KnowledgeBaseCategoryTranslationType",
    description: "This returns an object of the knowledge base category translation type",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID)},
        name: { type: GraphQLString },
        kb_locale_id: { type: GraphQLID },
        category_id: { type: GraphQLID },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString },
        ui_color: { type: GraphQLString },
        category_icon: { type: GraphQLString },
        title_tag: { type: GraphQLString },
        footer: { type: GraphQLString },
        keywords: { type: GraphQLString },
        meta_description: { type: GraphQLString },
        publish_now: { type: GraphQLBoolean },
        active: { type: GraphQLBoolean },
        permission: { type: GraphQLString },
        update_metadata: { type: GraphQLString },
        is_delete_scheduled: { type: GraphQLBoolean },
        is_update_scheduled: { type: GraphQLBoolean },
        knowledge_base_id: { type: GraphQLID },
        is_archived: { type: GraphQLBoolean },
        list_id: { type: GraphQLID }
    })
});
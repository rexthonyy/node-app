const {
    GraphQLString,
    GraphQLID,
    GraphQLBoolean,
    GraphQLInputObjectType,
    GraphQLInt
} = require("graphql");

module.exports = new GraphQLInputObjectType({
    name: "KnowledgeBaseCategoryTranslationTypeInput",
    description: "This is used to schedule a category for update",
    fields: () => ({
        knowledge_base_id: { type: GraphQLID },
        parent_id: { type: GraphQLID },
        category_id: { type: GraphQLID },
        kb_locale_id: { type: GraphQLID },
        category_icon: { type: GraphQLString },
        position: { type: GraphQLInt },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString },
        schedule_at: { type: GraphQLString},
        publish_now: { type: GraphQLBoolean },
        name: { type: GraphQLString },
        title_tag: { type: GraphQLString },
        footer: { type: GraphQLString },
        keywords: { type: GraphQLString },
        meta_description: { type: GraphQLString },
        permission: { type: GraphQLString },
        active: { type: GraphQLBoolean },
        list_id: { type: GraphQLID }
    })
});
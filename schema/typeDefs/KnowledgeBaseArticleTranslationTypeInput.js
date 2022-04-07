const {
    GraphQLString,
    GraphQLID,
    GraphQLBoolean,
    GraphQLInputObjectType,
    GraphQLInt
} = require("graphql");

module.exports = new GraphQLInputObjectType({
    name: "KnowledgeBaseArticleTranslationTypeInput",
    description: "This is used to schedule an article for update",
    fields: () => ({
        knowledge_base_id: { type: GraphQLID },
        category_id: { type: GraphQLID },
        article_id: { type: GraphQLID },
        kb_locale_id: { type: GraphQLID },
        title: { type: GraphQLString },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString },
        body: { type: GraphQLString },
        keywords: { type: GraphQLString },
        title_tag: { type: GraphQLString },
        meta_description: { type: GraphQLString },
        update_metadata: { type: GraphQLString },
        active: { type: GraphQLBoolean },
        publish_now: { type: GraphQLBoolean },
        list_id: { type: GraphQLInt },
        position: { type: GraphQLInt }
    })
});
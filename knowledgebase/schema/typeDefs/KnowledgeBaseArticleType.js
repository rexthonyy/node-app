const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLID,
    GraphQLBoolean,
    GraphQLInt
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "KnowledgeBaseArticleType",
    description: "This returns an object of the knowledge base article type",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID)},
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
        is_archived: { type: GraphQLBoolean },
        is_delete_scheduled: { type: GraphQLBoolean },
        is_update_scheduled: { type: GraphQLBoolean },
        ui_color: { type: GraphQLString },
        list_id: { type: GraphQLInt },
        position: { type: GraphQLInt }
    })
});
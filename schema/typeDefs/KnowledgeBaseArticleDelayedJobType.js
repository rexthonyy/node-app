const {
    GraphQLString,
    GraphQLID,
    GraphQLBoolean,
    GraphQLInputObjectType,
    GraphQLInt,
    GraphQLNonNull
} = require("graphql");

module.exports = new GraphQLInputObjectType({
    name: "KnowledgeBaseArticleDelayedJobType",
    description: "This is used to return a schedule for an article",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID)},
        knowledge_base_id: { type: GraphQLID },
        knowledge_base_article_id: { type: GraphQLID },
        knowledge_base_article_translation_id: { type: GraphQLID },
        run_at: { type: GraphQLString },
        created_at: { type: GraphQLString },
        publish_update_delete: { type: GraphQLString }
    })
});
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLID
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "KnowledgeBaseCategoryScheduleType",
    description: "This returns an object that will provides information about the time a category will be published, updated or deleted",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID)},
        knowledge_base_category_translation_id: { type: GraphQLNonNull(GraphQLID) },
        run_at: { type: GraphQLString },
        created_at: { type: GraphQLString },
        knowledge_base_id: { type: GraphQLNonNull(GraphQLID) },
        publish_update_delete: { type: GraphQLString }
    })
});
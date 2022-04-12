const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLID,
    GraphQLBoolean,
    GraphQLInt
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "KnowledgeBaseCategoryType",
    description: "This returns an object of the knowledge base category type",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID)},
        knowledge_base_id: { type: GraphQLID },
        parent_id: { type: GraphQLID },
        position: { type: GraphQLInt },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString },
        is_archived: { type: GraphQLBoolean }
    })
});
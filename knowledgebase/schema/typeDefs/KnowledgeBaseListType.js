const {
    GraphQLString,
    GraphQLID,
    GraphQLBoolean,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLNonNull
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "KnowledgeBaseListType",
    description: "This is used to return a list for the knowledge base",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID)},
        knowledge_base_id: { type: GraphQLNonNull(GraphQLID) },
        list_type: { type: GraphQLString },
        title: { type: GraphQLString },
        position: { type: GraphQLInt },
        created_at: { type: GraphQLString }
    })
});
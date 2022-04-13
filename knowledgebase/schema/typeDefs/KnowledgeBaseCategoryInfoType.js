const {
    GraphQLObjectType, GraphQLString
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "KnowledgeBaseCategoryInfoType",
    description: "This returns an object of the knowledge base info type",
    fields: () => ({
        parent_name: { type: GraphQLString }
    })
});
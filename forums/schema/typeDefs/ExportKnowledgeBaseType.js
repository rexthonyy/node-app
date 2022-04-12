const {
    GraphQLString,
    GraphQLObjectType
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "ExportKnowledgeBaseType",
    description: "This is used to return the link for the exported knowledgebase",
    fields: () => ({
        status: { type: GraphQLString },
        message: { type: GraphQLString },
        link: { type: GraphQLString }
    })
});
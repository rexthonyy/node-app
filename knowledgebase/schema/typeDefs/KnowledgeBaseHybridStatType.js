const {
    GraphQLObjectType
} = require("graphql");
const KnowledgeBaseType = require("./KnowledgeBaseType");
const KnowledgeBaseCategoryStatType = require("./KnowledgeBaseCategoryStatType");

module.exports = new GraphQLObjectType({
    name: "KnowledgeBaseCategoryHybridStatType",
    description: "This returns an object of the knowledge base category, knowledge base category translation and stat type",
    fields: () => ({
        data: { type: KnowledgeBaseType},
        stat: { type: KnowledgeBaseCategoryStatType}
    })
});
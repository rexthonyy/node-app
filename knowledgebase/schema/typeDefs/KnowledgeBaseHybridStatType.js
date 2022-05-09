const {
    GraphQLObjectType
} = require("graphql");
const KnowledgeBaseType = require("./KnowledgeBaseType");
const KnowledgeBaseCategoryStatType = require("./KnowledgeBaseCategoryStatType");

module.exports = new GraphQLObjectType({
    name: "KnowledgeBaseHybridStatType",
    description: "This returns an object of the knowledge base, knowledge base and stat type",
    fields: () => ({
        data: { type: KnowledgeBaseType},
        stat: { type: KnowledgeBaseCategoryStatType}
    })
});
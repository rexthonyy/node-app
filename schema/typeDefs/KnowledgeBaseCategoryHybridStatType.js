const {
    GraphQLObjectType
} = require("graphql");
const KnowledgeBaseCategoryHybridType = require("./KnowledgeBaseCategoryHybridType");
const KnowledgeBaseCategoryStatType = require("./KnowledgeBaseCategoryStatType");

module.exports = new GraphQLObjectType({
    name: "KnowledgeBaseCategoryHybridStatType",
    description: "This returns an object of the knowledge base category, knowledge base category translation and stat type",
    fields: () => ({
        knowledge_base_category: { type: KnowledgeBaseCategoryHybridType},
        stat: { type: KnowledgeBaseCategoryStatType}
    })
});
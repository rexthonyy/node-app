const {
    GraphQLObjectType
} = require("graphql");
const KnowledgeBaseCategoryTranslationType = require("./KnowledgeBaseCategoryTranslationType");
const KnowledgeBaseCategoryType = require("./KnowledgeBaseCategoryType");

module.exports = new GraphQLObjectType({
    name: "KnowledgeBaseCategoryHybridType",
    description: "This returns an object of the knowledge base category and knowledge base category translation type",
    fields: () => ({
        knowledge_base_category: { type: KnowledgeBaseCategoryType},
        knowledge_base_category_translation: { type: KnowledgeBaseCategoryTranslationType}
    })
});
const {
    GraphQLObjectType
} = require("graphql");

const KnowledgeBaseLevelStatusType = require("./KnowledgeBaseLevelStatusType");

module.exports = new GraphQLObjectType({
    name: "KnowledgeBaseLevelStatusHybridType",
    description: "An object that describes the status of categories and articles",
    fields: () => ({
            categories: { type: KnowledgeBaseLevelStatusType},
            articles: { type: KnowledgeBaseLevelStatusType }
    })
});
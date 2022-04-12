const {
    GraphQLObjectType,
    GraphQLInt
} = require("graphql");

const KnowledgeBaseLevelStatusDataType = require("./KnowledgeBaseLevelStatusDataType");

module.exports = new GraphQLObjectType({
    name: "KnowledgeBaseLevelStatusType",
    description: "An object that describes the status of a single category or article",
    fields: () => ({
            count: { type: GraphQLInt },
            no_action: { type: KnowledgeBaseLevelStatusDataType },
            draft: { type: KnowledgeBaseLevelStatusDataType },
            scheduled_to_publish: { type: KnowledgeBaseLevelStatusDataType },
            published: { type: KnowledgeBaseLevelStatusDataType },
            scheduled_to_update: { type: KnowledgeBaseLevelStatusDataType },
            scheduled_to_archive: { type: KnowledgeBaseLevelStatusDataType },
            archived: { type: KnowledgeBaseLevelStatusDataType }
    })
});
const {
    GraphQLObjectType,
    GraphQLString
} = require("graphql");

const KnowledgeBaseCategoryScheduleType = require("./KnowledgeBaseCategoryScheduleType");

module.exports = new GraphQLObjectType({
    name: "StatusMessageForKnowledgeBaseCategoryScheduleType",
    description: "A status message container for the KnowledgBaseCategoryScheduleType",
    fields: () => ({
        status: { type: GraphQLString },
        message: { type: GraphQLString },
        data: { type: KnowledgeBaseCategoryScheduleType}
    })
});
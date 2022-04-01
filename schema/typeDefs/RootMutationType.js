const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLInt
} = require("graphql");

const StatusMessageResponseType = require("./StatusMessageResponseType");
const rearrangeKnowledgeBasePositionsResolver = require("../resolvers/rearrangeKnowledgeBasePositionsResolver");

module.exports = new GraphQLObjectType({
    name: "Mutation",
    description: 'Root Mutation',
    fields: () => ({
        rearrangeKnowledgebasePositions: {
            type: StatusMessageResponseType,
            description: "Reorder the knowledgebase positions",
            args: {
                knowledge_base_ids: { type: GraphQLNonNull(GraphQLList(GraphQLInt))}
            },
            resolve: rearrangeKnowledgeBasePositionsResolver
        }
    })
});

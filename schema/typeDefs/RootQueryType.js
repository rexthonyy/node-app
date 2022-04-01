const {
    GraphQLObjectType,
    GraphQLList
} = require("graphql");

const KnowledgeBaseType = require("./KnowledgeBaseType");
const getAllKnowledgeBaseResolver = require("../resolvers/getAllKnowledgeBaseResolver");

module.exports = new GraphQLObjectType({
    name: "Query",
    description: 'Root Query',
    fields: () => ({
        knowledgebases: {
            type: GraphQLList(KnowledgeBaseType),
            description: "Get all knowledge bases",
            resolve: getAllKnowledgeBaseResolver
        }
    })
});

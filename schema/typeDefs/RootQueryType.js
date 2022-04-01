const {
    GraphQLObjectType,
    GraphQLList,
    GraphQLID
} = require("graphql");

const KnowledgeBaseType = require("./KnowledgeBaseType");
const getAllKnowledgeBaseResolver = require("../resolvers/getAllKnowledgeBaseResolver");
const getKnowledgeBaseByIdResolver = require("../resolvers/getKnowledgeBaseByIdResolver");

module.exports = new GraphQLObjectType({
    name: "Query",
    description: 'Root Query',
    fields: () => ({
        knowledgebases: {
            type: GraphQLList(KnowledgeBaseType),
            description: "Get all knowledgebases",
            resolve: getAllKnowledgeBaseResolver
        },
        knowledgebase: {
            type: KnowledgeBaseType,
            description: "Get a single knowledgebase by id",
            args: {
                id: { type: GraphQLID }
            },
            resolve: getKnowledgeBaseByIdResolver
        }
    })
});

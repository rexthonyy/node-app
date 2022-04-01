const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLInt,
    GraphQLBoolean
} = require("graphql");

// typedefs
const StatusMessageResponseType = require("./StatusMessageResponseType");
const KnowledgeBaseType = require("./KnowledgeBaseType");
const KnowledgebaseCreateLocaleType = require("./KnowledgebaseCreateLocaleType");

// resolvers
const rearrangeKnowledgeBasePositionsResolver = require("../resolvers/rearrangeKnowledgeBasePositionsResolver");
const createKnowledgebaseResolver = require("../resolvers/createKnowledgebaseResolver");

module.exports = new GraphQLObjectType({
    name: "Mutation",
    description: 'Root Mutation',
    fields: () => ({
        createKnowledgebase: {
            type: KnowledgeBaseType,
            description: "Creates a new knowledgebase",
            args: {
                name: { type: GraphQLNonNull(GraphQLString)},
                icon: { type: GraphQLString },
                homepage_layout: { type: GraphQLString },
                category_layout: { type: GraphQLString },
                active: { type: GraphQLBoolean },
                front_page: { type: GraphQLString },
                kb_locale_ids: { type: GraphQLList(KnowledgebaseCreateLocaleType)}
            },
            resolve: createKnowledgebaseResolver
        },
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

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLID
} = require("graphql");

// typedefs
const StatusMessageResponseType = require("./StatusMessageResponseType");
const KnowledgeBaseType = require("./KnowledgeBaseType");
const KnowledgebaseCreateLocaleType = require("./KnowledgebaseCreateLocaleType");

// resolvers
const rearrangeKnowledgeBasePositionsResolver = require("../resolvers/rearrangeKnowledgeBasePositionsResolver");
const createKnowledgebaseResolver = require("../resolvers/createKnowledgebaseResolver");
const updateKnowledgebaseResolver = require("../resolvers/updateKnowledgebaseResolver");

module.exports = new GraphQLObjectType({
    name: "Mutation",
    description: 'Root Mutation',
    fields: () => ({
        createKnowledgebase: {
            type: StatusMessageResponseType,
            description: "Creates a new knowledgebase",
            args: {
                name: { type: GraphQLNonNull(GraphQLString)},
                icon: { type: GraphQLNonNull(GraphQLString) },
                footer: { type: GraphQLNonNull(GraphQLString) },
                homepage_layout: { type: GraphQLNonNull(GraphQLString) },
                category_layout: { type: GraphQLNonNull(GraphQLString) },
                active: { type: GraphQLNonNull(GraphQLBoolean) },
                front_page: { type: GraphQLNonNull(GraphQLString) },
                kb_locale_ids: { type: GraphQLNonNull(GraphQLList(KnowledgebaseCreateLocaleType))}
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
        },
        updateKnowledgebase: {
            type: StatusMessageResponseType,
            description: "Updates a knowledgebase",
            args: {
                knowledge_base_id: { type: GraphQLNonNull(GraphQLID)},
                name: { type: GraphQLNonNull(GraphQLString)},
                icon: { type: GraphQLNonNull(GraphQLString) },
                footer: { type: GraphQLNonNull(GraphQLString) },
                homepage_layout: { type: GraphQLNonNull(GraphQLString) },
                category_layout: { type: GraphQLNonNull(GraphQLString) },
                active: { type: GraphQLNonNull(GraphQLBoolean) },
                front_page: { type: GraphQLNonNull(GraphQLString) },
                kb_locale_ids: { type: GraphQLNonNull(GraphQLList(KnowledgebaseCreateLocaleType))}
            },
            resolve: updateKnowledgebaseResolver
        }
    })
});

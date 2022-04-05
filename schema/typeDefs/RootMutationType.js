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
const rearrangeKnowledgeBaseCategoryPositionsResolver = require("../resolvers/rearrangeKnowledgeBaseCategoryPositionsResolver");
const createKnowledgebaseCategoryResolver = require("../resolvers/createKnowledgebaseCategoryResolver");

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
        },
        rearrangeKnowledgebasePositions: {
            type: StatusMessageResponseType,
            description: "Reorder the knowledgebase positions",
            args: {
                knowledge_base_ids: { type: GraphQLNonNull(GraphQLList(GraphQLInt))}
            },
            resolve: rearrangeKnowledgeBasePositionsResolver
        },
        rearrangeKnowledgebaseCategoryPositions: {
            type: StatusMessageResponseType,
            description: "Reorder the knowledgebase category positions",
            args: {
                category_ids: { type: GraphQLNonNull(GraphQLList(GraphQLInt))}
            },
            resolve: rearrangeKnowledgeBaseCategoryPositionsResolver
        },
        createKnowledgeBaseCategory: {
            type: StatusMessageResponseType,
            description: "Creates a knowledgebase category",
            args: {
                knowledge_base_id: { type: GraphQLNonNull(GraphQLID)},
                kb_locale_id: { type: GraphQLNonNull(GraphQLID)},
                parent_id: { type: GraphQLNonNull(GraphQLID)},
                category_id: { type: GraphQLNonNull(GraphQLID)},
                category_icon: { type: GraphQLString},
                position: { type: GraphQLInt},
                created_at: { type: GraphQLString},
                updated_at: { type: GraphQLString},
                schedule_at: { type: GraphQLString},
                publish_now: { type: GraphQLNonNull(GraphQLBoolean)},
                name: { type: GraphQLNonNull(GraphQLString)},
                title_tag: { type: GraphQLString},
                footer: { type: GraphQLString},
                keywords: { type: GraphQLString},
                meta_description: { type: GraphQLString},
                permission: { type: GraphQLString},
                active: { type: GraphQLNonNull(GraphQLBoolean)},
                list_id: { type: GraphQLInt}
            },
            resolve: createKnowledgebaseCategoryResolver
        },
    })
});

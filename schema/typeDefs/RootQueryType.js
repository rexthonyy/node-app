const {
    GraphQLObjectType,
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt
} = require("graphql");

// data types
const KnowledgeBaseType = require("./KnowledgeBaseType");
const KnowledgeBaseTranslationType = require("./KnowledgeBaseTranslationType");
const KnowledgeBaseTranslationStatusColorType = require("./KnowledgeBaseTranslationStatusColorType");
const StatusMessageForKnowledgeBaseCategoryScheduleType = require("./StatusMessageForKnowledgeBaseCategoryScheduleType");
const KnowledgeBaseCategoryHybridStatType = require("./KnowledgeBaseCategoryHybridStatType");
const KnowledgeBaseCategoryType = require("./KnowledgeBaseCategoryType");
const KnowledgeBaseArticleType = require("./KnowledgeBaseArticleType");

// resolvers
const getAllKnowledgeBaseResolver = require("../resolvers/getAllKnowledgeBaseResolver");
const getKnowledgeBaseByIdResolver = require("../resolvers/getKnowledgeBaseByIdResolver");
const getAllKnowledgeBaseTranslationsForKnowledgeBaseResolver = require("../resolvers/getAllKnowledgeBaseTranslationsForKnowledgeBaseResolver");
const getAllKnowledgeBaseTranslationStatusColorResolver = require("../resolvers/getAllKnowledgeBaseTranslationStatusColorResolver");
const getScheduleForKnowledgebaseCategoryTranslationResolver = require("../resolvers/getScheduleForKnowledgebaseCategoryTranslationResolver");
const getKnowledgeBaseCategoriesResolver = require("../resolvers/getKnowledgeBaseCategoriesResolver");
const getKnowledgeBaseCategoryTranslationResolver = require("../resolvers/getKnowledgeBaseCategoryTranslationResolver");
const getKnowledgeBaseCategoryResolver = require("../resolvers/getKnowledgeBaseCategoryResolver");
const getKnowledgeBaseArticlesResolver = require("../resolvers/getKnowledgeBaseArticlesResolver");

module.exports = new GraphQLObjectType({
    name: "Query",
    description: 'Root Query',
    fields: () => ({
        knowledgebases_: {
            type: GraphQLList(KnowledgeBaseType),
            description: "Get all knowledgebases",
            resolve: getAllKnowledgeBaseResolver
        },
        knowledgebase_: {
            type: KnowledgeBaseType,
            description: "Get a single knowledgebase by id",
            args: {
                knowledge_base_id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve: getKnowledgeBaseByIdResolver
        },
        knowledgebaseTranslations_: {
            type: GraphQLList(KnowledgeBaseTranslationType),
            description: "Get all knowledgebase translations for a given knowledge base",
            args: {
                knowledge_base_id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve: getAllKnowledgeBaseTranslationsForKnowledgeBaseResolver
        },
        knowledgebaseTranslationStatusColor_: {
            type: GraphQLList(KnowledgeBaseTranslationStatusColorType),
            description: "Get the status color for the knowledgebase translations at the category specified",
            args: {
                filter_by: { type: GraphQLNonNull(GraphQLString) },
                knowledge_base_id: { type: GraphQLNonNull(GraphQLID) },
                category_id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve: getAllKnowledgeBaseTranslationStatusColorResolver
        },
        getScheduleForKnowledgebaseCategoryTranslation_: {
            type: StatusMessageForKnowledgeBaseCategoryScheduleType,
            description: "Get a knowledgebase translation that is scheduled for publication, deletion or update",
            args: {
                knowledge_base_category_translation_id: { type: GraphQLNonNull(GraphQLID) },
                operation: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: getScheduleForKnowledgebaseCategoryTranslationResolver
        },
        getKnowledgebaseCategories_: {
            type: GraphQLList(KnowledgeBaseCategoryHybridStatType),
            description: "Get all knowledgebase category translations in a knowledge base for a specified locale and level",
            args: {
                knowledge_base_id: { type: GraphQLNonNull(GraphQLID) },
                kb_locale_id: { type: GraphQLNonNull(GraphQLID) },
                level: { type: GraphQLInt },
                parent_id: { type: GraphQLID }
            },
            resolve: getKnowledgeBaseCategoriesResolver
        },
        getKnowledgeBaseCategoryTranslation_: {
            type: KnowledgeBaseCategoryHybridStatType,
            description: "Get a knowledgebase category translations in a knowledge base for a specified locale",
            args: {
                category_id: { type: GraphQLNonNull(GraphQLID) },
                kb_locale_id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve: getKnowledgeBaseCategoryTranslationResolver
        },
        getKnowledgeBaseCategory_: {
            type: KnowledgeBaseCategoryType,
            description: "Get a knowledgebase category by id",
            args: {
                category_id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve: getKnowledgeBaseCategoryResolver
        },
        getKnowledgeBaseArticles_: {
            type: KnowledgeBaseArticleType,
            description: "Get all knowledgebase category articles in for a locale",
            args: {
                category_id: { type: GraphQLNonNull(GraphQLID) },
                kb_locale_id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve: getKnowledgeBaseArticlesResolver
        },
    })
});

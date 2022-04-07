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
const KnowledgeBaseArticleDelayedJobType = require("./KnowledgeBaseArticleDelayedJobType");
const KnowledgeBaseListType = require("./KnowledgeBaseListType");
const KnowledgeBaseLevelStatusHybridType = require("./KnowledgeBaseLevelStatusHybridType");
const KnowledgeBaseCategoryLevelType = require("./KnowledgeBaseCategoryLevelType");

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
const getKnowledgeBaseArticleTranslationResolver = require("../resolvers/getKnowledgeBaseArticleTranslationResolver");
const getScheduleForKnowledgeBaseArticleResolver = require("../resolvers/getScheduleForKnowledgeBaseArticleResolver");
const getKnowledgeBaseListResolver = require("../resolvers/getKnowledgeBaseListResolver");
const getLevelStatusResolver = require("../resolvers/getLevelStatusResolver");
const getKnowledgeBaseCategoryLevelResolver = require("../resolvers/getKnowledgeBaseCategoryLevelResolver");

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
            type: GraphQLList(KnowledgeBaseArticleType),
            description: "Get all knowledgebase category articles in for a locale at a given level",
            args: {
                knowledge_base_id: { type: GraphQLNonNull(GraphQLID) },
                category_id: { type: GraphQLNonNull(GraphQLID) },
                kb_locale_id: { type: GraphQLNonNull(GraphQLID) },
                parent_id: { type: GraphQLID },
                level: { type: GraphQLInt }
            },
            resolve: getKnowledgeBaseArticlesResolver
        },
        getKnowledgeBaseArticleTranslation_: {
            type: KnowledgeBaseArticleType,
            description: "Returns a knowledge base article translation for a given locale",
            args: {
                article_id: { type: GraphQLNonNull(GraphQLID) },
                kb_locale_id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve: getKnowledgeBaseArticleTranslationResolver
        },
        getScheduleForKnowledgeBaseArticle_: {
            type: KnowledgeBaseArticleDelayedJobType,
            description: "Returns details about a scheduled knowledgebase article for deletion or update",
            args: {
                knowledge_base_article_translation_id: { type: GraphQLNonNull(GraphQLID)},
                schedule_type: { type: GraphQLNonNull(GraphQLString)}
            },
            resolve: getScheduleForKnowledgeBaseArticleResolver
        },
        getScheduleForKnowledgeBaseArticle_: {
            type: KnowledgeBaseArticleDelayedJobType,
            description: "Returns details about a scheduled knowledgebase article for deletion or update",
            args: {
                knowledge_base_article_translation_id: { type: GraphQLNonNull(GraphQLID)},
                schedule_type: { type: GraphQLNonNull(GraphQLString)}
            },
            resolve: getScheduleForKnowledgeBaseArticleResolver
        },
        getKnowledgeBaseList_: {
            type: GraphQLList(KnowledgeBaseListType),
            description: "Returns the list for the knowledgebase specified",
            args: {
                knowledge_base_id: { type: GraphQLNonNull(GraphQLID)},
                list_type: { type: GraphQLNonNull(GraphQLString)}
            },
            resolve: getKnowledgeBaseListResolver
        },
        getLevelStatus_: {
            type: KnowledgeBaseLevelStatusHybridType,
            description: "Returns the status of a level",
            args: {
                knowledge_base_id: { type: GraphQLNonNull(GraphQLID)},
                kb_locale_id: { type: GraphQLNonNull(GraphQLID)},
                level: { type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: getLevelStatusResolver
        },
        getKnowledgeBaseCategoryLevel_: {
            type: KnowledgeBaseCategoryLevelType,
            description: "Returns the level and depth of a knowledge base category",
            args: {
                knowledge_base_id: { type: GraphQLNonNull(GraphQLID)},
                category_id: { type: GraphQLNonNull(GraphQLID)},
                kb_locale_id: { type: GraphQLNonNull(GraphQLID)}
            },
            resolve: getKnowledgeBaseCategoryLevelResolver
        },
    })
});

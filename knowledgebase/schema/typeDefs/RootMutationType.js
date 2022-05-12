const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLID
} = require("graphql");

const { GraphQLUpload } = require("graphql-upload");

// typedefs
const StatusMessageResponseType = require("./StatusMessageResponseType");
const KnowledgeBaseCategoryTranslationTypeInput = require("./KnowledgeBaseCategoryTranslationTypeInput");
const KnowledgeBaseArticleTranslationTypeInput = require("./KnowledgeBaseArticleTranslationTypeInput");
const KnowledgebaseCreateLocaleType = require("./KnowledgebaseCreateLocaleType");

// resolvers
const importKnowledgebaseResolver = require("../resolvers/importKnowledgebaseResolver");
const rearrangeKnowledgeBasePositionsResolver = require("../resolvers/rearrangeKnowledgeBasePositionsResolver");
const createKnowledgebaseResolver = require("../resolvers/createKnowledgebaseResolver");
const updateKnowledgebaseResolver = require("../resolvers/updateKnowledgebaseResolver");
const rearrangeKnowledgeBaseCategoryPositionsResolver = require("../resolvers/rearrangeKnowledgeBaseCategoryPositionsResolver");
const createKnowledgebaseCategoryResolver = require("../resolvers/createKnowledgebaseCategoryResolver");
const updateKnowledgebaseCategoryResolver = require("../resolvers/updateKnowledgebaseCategoryResolver");
const scheduleKnowledgeBaseCategoryUpdateResolver = require("../resolvers/scheduleKnowledgeBaseCategoryUpdateResolver");
const archiveKnowledgeBaseCategoryResolver = require("../resolvers/archiveKnowledgeBaseCategoryResolver");
const unarchiveKnowledgeBaseCategoryResolver = require("../resolvers/unarchiveKnowledgeBaseCategoryResolver");
const removeScheduleForKnowledgebaseCategoryResolver = require("../resolvers/removeScheduleForKnowledgebaseCategoryResolver");
const scheduleKnowledgeBaseCategoryDeleteResolver = require("../resolvers/scheduleKnowledgeBaseCategoryDeleteResolver");
const rearrangeKnowledgeBaseArticlePositionsResolver = require("../resolvers/rearrangeKnowledgeBaseArticlePositionsResolver");
const createKnowledgebaseArticleResolver = require("../resolvers/createKnowledgebaseArticleResolver");
const updateKnowledgebaseArticleResolver = require("../resolvers/updateKnowledgebaseArticleResolver");
const archiveKnowledgeBaseArticleResolver = require("../resolvers/archiveKnowledgeBaseArticleResolver");
const unarchiveKnowledgeBaseArticleResolver = require("../resolvers/unarchiveKnowledgeBaseArticleResolver");
const scheduleKnowledgeBaseArticleUpdateResolver = require("../resolvers/scheduleKnowledgeBaseArticleUpdateResolver");
const scheduleKnowledgeBaseArticleDeleteResolver = require("../resolvers/scheduleKnowledgeBaseArticleDeleteResolver");
const removeScheduleForKnowledgeBaseArticleResolver = require("../resolvers/removeScheduleForKnowledgeBaseArticleResolver");
const deleteIconResolver = require("../resolvers/deleteIconResolver");

module.exports = new GraphQLObjectType({
    name: "Mutation",
    description: 'Root Mutation',
    fields: () => ({
        importKnowledgebase_: {
            type: GraphQLBoolean,
            description: "Imports a knowledgebase",
            args: {
                image: {
                    description: "Image file.",
                    type: GraphQLUpload,
                }
            },
            resolve: importKnowledgebaseResolver
        },
        createKnowledgebase_: {
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
        updateKnowledgebase_: {
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
        rearrangeKnowledgebasePositions_: {
            type: StatusMessageResponseType,
            description: "Reorder the knowledgebase positions",
            args: {
                knowledge_base_ids: { type: GraphQLNonNull(GraphQLList(GraphQLInt))}
            },
            resolve: rearrangeKnowledgeBasePositionsResolver
        },
        rearrangeKnowledgebaseCategoryPositions_: {
            type: StatusMessageResponseType,
            description: "Reorder the knowledgebase category positions",
            args: {
                category_ids: { type: GraphQLNonNull(GraphQLList(GraphQLInt))}
            },
            resolve: rearrangeKnowledgeBaseCategoryPositionsResolver
        },
        rearrangeKnowledgebaseArticlePositions_: {
            type: StatusMessageResponseType,
            description: "Reorder the knowledgebase article positions",
            args: {
                article_ids: { type: GraphQLNonNull(GraphQLList(GraphQLInt))}
            },
            resolve: rearrangeKnowledgeBaseArticlePositionsResolver
        },
        createKnowledgeBaseCategory_: {
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
        updateKnowledgeBaseCategory_: {
            type: StatusMessageResponseType,
            description: "Updates a knowledgebase category",
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
            resolve: updateKnowledgebaseCategoryResolver
        },
        scheduleKnowledgebaseCategoryDelete_: {
            type: StatusMessageResponseType,
            description: "Schedules a category for deletion",
            args: {
                knowledge_base_category_translation_id: { type: GraphQLNonNull(GraphQLID)},
                run_at: { type: GraphQLNonNull(GraphQLString)},
                knowledge_base_id: { type: GraphQLNonNull(GraphQLID)}
            },
            resolve: scheduleKnowledgeBaseCategoryDeleteResolver
        },
        scheduleKnowledgeBaseCategoryUpdate_: {
            type: StatusMessageResponseType,
            description: "Schedules a category for update",
            args: {
                knowledge_base_category_translation_id: { type: GraphQLNonNull(GraphQLID)},
                run_at: { type: GraphQLString},
                knowledge_base_id: { type: GraphQLNonNull(GraphQLID)},
                update_metadata: { type: GraphQLNonNull(KnowledgeBaseCategoryTranslationTypeInput)}
            },
            resolve: scheduleKnowledgeBaseCategoryUpdateResolver
        },
        archiveKnowledgeBaseCategory_: {
            type: StatusMessageResponseType,
            description: "Archives a category with its subcategories and translations",
            args: {
                category_id: { type: GraphQLNonNull(GraphQLID)}
            },
            resolve: archiveKnowledgeBaseCategoryResolver
        },
        unarchiveKnowledgeBaseCategory_: {
            type: StatusMessageResponseType,
            description: "Reinstates a category with its subcategories and translations",
            args: {
                category_id: { type: GraphQLNonNull(GraphQLID)}
            },
            resolve: unarchiveKnowledgeBaseCategoryResolver
        },
        removeScheduleForKnowledgebaseCategory_: {
            type: StatusMessageResponseType,
            description: "Removes a category from being scheduled for deletion, update or publication",
            args: {
                knowledge_base_category_translation_id: { type: GraphQLNonNull(GraphQLID)},
                schedule_type: { type: GraphQLNonNull(GraphQLString)}
            },
            resolve: removeScheduleForKnowledgebaseCategoryResolver
        },
        createKnowledgeBaseArticle_: {
            type: StatusMessageResponseType,
            description: "Creates a knowledgebase article",
            args: {
                knowledge_base_id: { type: GraphQLNonNull(GraphQLID)},
                kb_locale_id: { type: GraphQLNonNull(GraphQLID)},
                category_id: { type: GraphQLNonNull(GraphQLID)},
                article_id: { type: GraphQLID},
                position: { type: GraphQLInt},
                created_at: { type: GraphQLString},
                updated_at: { type: GraphQLString},
                title: { type: GraphQLNonNull(GraphQLString)},
                body: { type: GraphQLString},
                keywords: { type: GraphQLString},
                title_tag: { type: GraphQLString},
                meta_description: { type: GraphQLString},
                active: { type: GraphQLNonNull(GraphQLBoolean)},
                publish_now: { type: GraphQLNonNull(GraphQLBoolean)},
                schedule_at: { type: GraphQLString},
                list_id: { type: GraphQLInt}
            },
            resolve: createKnowledgebaseArticleResolver
        },
        updateKnowledgeBaseArticle_: {
            type: StatusMessageResponseType,
            description: "Updates a knowledgebase article",
            args: {
                knowledge_base_id: { type: GraphQLNonNull(GraphQLID)},
                kb_locale_id: { type: GraphQLNonNull(GraphQLID)},
                category_id: { type: GraphQLNonNull(GraphQLID)},
                article_id: { type: GraphQLNonNull(GraphQLID)},
                position: { type: GraphQLInt},
                created_at: { type: GraphQLString},
                updated_at: { type: GraphQLString},
                title: { type: GraphQLNonNull(GraphQLString)},
                body: { type: GraphQLString},
                keywords: { type: GraphQLString},
                title_tag: { type: GraphQLString},
                meta_description: { type: GraphQLString},
                active: { type: GraphQLNonNull(GraphQLBoolean)},
                publish_now: { type: GraphQLNonNull(GraphQLBoolean)},
                schedule_at: { type: GraphQLString},
                list_id: { type: GraphQLInt}
            },
            resolve: updateKnowledgebaseArticleResolver
        },
        archiveKnowledgeBaseArticle_: {
            type: StatusMessageResponseType,
            description: "Archives an article with its translations",
            args: {
                category_id: { type: GraphQLNonNull(GraphQLID)}
            },
            resolve: archiveKnowledgeBaseArticleResolver
        },
        unarchiveKnowledgeBaseArticle_: {
            type: StatusMessageResponseType,
            description: "Reinstates an article with its translations",
            args: {
                category_id: { type: GraphQLNonNull(GraphQLID)}
            },
            resolve: unarchiveKnowledgeBaseArticleResolver
        },
        scheduleKnowledgeBaseArticleUpdate_: {
            type: StatusMessageResponseType,
            description: "Schedules an article for update",
            args: {
                knowledge_base_article_translation_id: { type: GraphQLNonNull(GraphQLID)},
                run_at: { type: GraphQLString},
                knowledge_base_id: { type: GraphQLNonNull(GraphQLID)},
                article_id: { type: GraphQLNonNull(GraphQLID)},
                update_metadata: { type: GraphQLNonNull(KnowledgeBaseArticleTranslationTypeInput)}
            },
            resolve: scheduleKnowledgeBaseArticleUpdateResolver
        },
        scheduleKnowledgebaseArticleDelete_: {
            type: StatusMessageResponseType,
            description: "Schedules an article for deletion",
            args: {
                knowledge_base_article_translation_id: { type: GraphQLNonNull(GraphQLID)},
                run_at: { type: GraphQLNonNull(GraphQLString)},
                knowledge_base_id: { type: GraphQLNonNull(GraphQLID)},
                article_id: { type: GraphQLNonNull(GraphQLID)}
            },
            resolve: scheduleKnowledgeBaseArticleDeleteResolver
        },
        removeScheduleForKnowledgeBaseArticle_: {
            type: StatusMessageResponseType,
            description: "Removes the schedule for an article either update or delete",
            args: {
                knowledge_base_article_translation_id: { type: GraphQLNonNull(GraphQLID)},
                schedule_type: { type: GraphQLNonNull(GraphQLString)}
            },
            resolve: removeScheduleForKnowledgeBaseArticleResolver
        },
        deleteIcon_: {
            type: StatusMessageResponseType,
            description: "Deletes an uploaded icon",
            args: {
                filename: { type: GraphQLNonNull(GraphQLString)}
            },
            resolve: deleteIconResolver
        },
    })
});

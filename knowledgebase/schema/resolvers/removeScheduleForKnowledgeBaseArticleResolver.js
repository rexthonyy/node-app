const pgQueries = require('../../postgres/kb-queries');
const recordHistory = require('../resolverUtils/recordHistoryResolver');

const getData = ({knowledge_base_article_translation_id, schedule_type}) => {
    return new Promise((resolve, reject) => {
        if(!["publish","update","delete"].find(type => type == schedule_type)) return reject({ status: "error", message: "schedule type must be 'publish','update', or 'delete'"});

        let values = [
            knowledge_base_article_translation_id,
            schedule_type
        ];
        pgQueries.deleteKnowledgeBaseArticleDelayedJobByScheduleType(values, result => {
            if(result.err){
                result.err.errorIndex = 3277;
                return reject(result.err);
            }
    
            switch(schedule_type){
                case "delete":
                    values = [
                        knowledge_base_article_translation_id,
                        false
                    ];
                    pgQueries.updateKnowledgeBaseArticleTranslationDeleteSchedule(values, result1 => {
                        if(result1.err){
                            result1.err.errorIndex = 38621;
                            return reject(result1.err);
                        }
    
                        recordHistory(
                            "knowledgebase", 
                            "remove-schedule-delete-knowledgebasearticle", 
                            {
                                knowledge_base_article_translation_id
                                //user_identity
                            }, 
                            () => {
                                resolve({ status: "success", message: "Removed schedule to delete article" });
                            }
                        );
                    });
                break;
    
                case "publish":
                    // update the publish_now variable in knowledge_base_article_translation
                    values = [
                        knowledge_base_article_translation_id,
                        true,
                        true
                    ];
                    pgQueries.updateKnowledgeBaseArticleTranslationPublishSchedule(values, result1 => {
                        if(result1.err){
                            result1.err.errorIndex = 31277;
                            return reject(result1.err);
                        }
    
                        recordHistory(
                            "knowledgebase", 
                            "remove-schedule-publish-knowledgebasearticle", 
                            {
                                knowledge_base_article_translation_id
                                //user_identity
                            }, 
                            () => {
                                resolve({ status: "success", message: "Removed schedule to publish article" });
                            }
                        );
                    });
                break;
    
                case "update":
                    // update the metadata variable in knowledge_base_article_translation
                    values = [
                        knowledge_base_article_translation_id,
                        false,
                        ""
                    ];
                    pgQueries.updateKnowledgeBaseArticleTranslationUpdateSchedule(values, result1 => {
                        if(result1.err){
                            result1.err.errorIndex = 31277;
                            return reject(result1.err);
                        }
    
                        recordHistory(
                            "knowledgebase", 
                            "remove-schedule-update-knowledgebasearticle", 
                            {
                                knowledge_base_article_translation_id
                                //user_identity
                            }, 
                            () => {
                                resolve({ status: "success", message: "Removed schedule to update article" });
                            }
                        );
                    });
                break;
            }
        });
    });
}

module.exports = async (parent, args) => {
    return await getData(args);
}
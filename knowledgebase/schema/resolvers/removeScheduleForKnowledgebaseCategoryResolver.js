const pgQueries = require('../../postgres/kb-queries');
const recordHistory = require('../resolverUtils/recordHistoryResolver');
const consts = require('../../consts');

const getData = ({knowledge_base_category_translation_id, schedule_type}) => {
    return new Promise((resolve, reject) => {
        if(!["publish","update","delete"].find(type => type == schedule_type)) return reject({ status: "error", message: "schedule type must be 'publish','update', or 'delete'"});

        let values = [
            knowledge_base_category_translation_id,
            schedule_type
        ];

        pgQueries.deleteKnowledgeBaseCategoryDelayedJobByScheduleType(values, result => {
            if(result.err){
                result.err.errorIndex = 3277;
                return reject(result.err);
            }

            switch(schedule_type){
                case "delete":
                    values = [
                        knowledge_base_category_translation_id,
                        false,
                        consts.STATUS_COLOR.published
                    ];
                    pgQueries.updateKnowledgeBaseCategoryTranslationDeleteSchedule(values, result1 => {
                        if(result1.err){
                            result1.err.errorIndex = 3621;
                            return reject(result1.err);
                        }

                        recordHistory(
                            "knowledgebase", 
                            "remove-schedule-delete-knowledgebasecategory", 
                            {
                                knowledge_base_category_translation_id
                                //user_identity
                            }, 
                            () => {
                                resolve({ 
                                    status: "success", 
                                    message: "Removed schedule to delete category" 
                                });
                            }
                        );
                    });

                break;

                case "publish":
                    // update the publish_now variable in knowledge_base_category_translation
                    values = [
                        knowledge_base_category_translation_id,
                        true,
                        true
                    ];
                    pgQueries.updateKnowledgeBaseCategoryTranslationPublishSchedule(values, result1 => {
                        if(result1.err){
                            result1.err.errorIndex = 31277;
                            return reject(result1.err);
                        }

                        recordHistory(
                            "knowledgebase", 
                            "remove-schedule-publish-knowledgebasecategory", 
                            {
                                knowledge_base_category_translation_id
                                //user_identity
                            }, 
                            () => {
                                resolve({ 
                                    status: "success", 
                                    message: "Removed schedule to publish category" 
                                });
                            }
                        );
                        
                    });
                break;

                case "update":
                    // update the metadata variable in knowledge_base_category_translation
                    values = [
                        knowledge_base_category_translation_id,
                        false,
                        "",
                        consts.STATUS_COLOR.published
                    ];
                    pgQueries.updateKnowledgeBaseCategoryTranslationUpdateSchedule(values, result1 => {
                        if(result1.err){
                            result1.err.errorIndex = 31277;
                            return reject(result1.err);
                        }

                        recordHistory(
                            "knowledgebase", 
                            "remove-schedule-update-knowledgebasecategory", 
                            {
                                knowledge_base_category_translation_id
                                //user_identity
                            }, 
                            () => {
                                resolve({ 
                                    status: "success",
                                    message: "Removed schedule to update category" 
                                });
                            }
                        );

                    });
                break;
            }
        });
    });
}

module.exports = async (parents, args) => {
    return getData(args);
}
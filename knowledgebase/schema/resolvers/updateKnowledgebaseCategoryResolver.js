const pgQueries = require('../../postgres/kb-queries');
const recordHistory = require('../resolverUtils/recordHistoryResolver');
const consts = require('../../consts');
const updateUIColorForKnowledgeBase = require('../resolverUtils/updateUIColorForKnowledgeBase');

const getData = ({
    knowledge_base_id, 
    kb_locale_id, 
    parent_id,
    category_id, 
    category_icon, 
    position, 
    created_at, 
    updated_at,
    schedule_at,
    publish_now,
    name,
    title_tag,
    footer,
    keywords,
    meta_description,
    permission,
    active,
    list_id
}) => {
    return new Promise((resolve, reject) => {
        
        // prevent the categories from being scheduled for publication at a time in the past
        if(!publish_now){
            if(schedule_at != null){
                let scheduled_date = new Date(schedule_at);
                if(scheduled_date.getTime() < Date.now()){
                    return reject({ status: "error", message: "You cannot schedule to publish a category in the past" });
                }
            }
        }

        let values = [
            knowledge_base_id ? knowledge_base_id : 1,
            parent_id ? parent_id : -1,
            position ? position: -1,
            created_at ? created_at : new Date().toUTCString(),
            updated_at ? updated_at : new Date().toUTCString(),
            category_id
        ];

        pgQueries.updateKnowledgeBaseCategory(values, result => {
            if(result.err){
                result.err.errorIndex = 374849;
                return reject(result.err);
            }

            let values1 = [
                name ? name : "",
                kb_locale_id,
                category_id ? category_id : 1,
                created_at ? created_at : new Date().toUTCString(),
                updated_at ? updated_at : new Date().toUTCString(),
                consts.STATUS_COLOR.pending_action,
                category_icon ? category_icon : "",
                title_tag ? title_tag : "",
                footer ? footer : "",
                keywords ? keywords : "",
                meta_description ? meta_description : "",
                publish_now ? publish_now : true,
                active  ? active : true,
                permission ? permission : "",
                list_id ? list_id : null,
                knowledge_base_id
            ];

            if(!active){
                if(!publish_now){
                    values1[5] = consts.STATUS_COLOR.publish_scheduled;
                }else{
                    values1[5] = consts.STATUS_COLOR.draft;
                }
            }else{
                if(!publish_now){
                    values1[5] = consts.STATUS_COLOR.publish_scheduled;
                }else{
                    values1[5] = consts.STATUS_COLOR.published;
                }
            }

            pgQueries.updateKnowledgeBaseCategoryTranslation(category_id, kb_locale_id, values1, result => {
                if(result.err){
                    result.err.errorIndex = 83782;
                    return reject(result.err);
                }

                let knowledge_base_category_translation = result.res;
                let knowledge_base_category_translation_id = knowledge_base_category_translation.id;

                pgQueries.deleteKnowledgeBaseCategoryDelayedJobByScheduleType([knowledge_base_category_translation_id, "publish"], result2 => {
                    if(result2.err){
                        result2.err.errorIndex = 736282;
                        return reject(result2.err);
                    }
        
                    if(publish_now){
                        return resolve({
                            status: "success",
                            message: "Knowledgebase category updated successfully"
                        });
                    }else{
                        let run_at = schedule_at;
            
                        let values = [
                            knowledge_base_category_translation_id,
                            run_at,
                            knowledge_base_id,
                            "publish"
                        ];
                        pgQueries.createKnowledgeBaseCategoryDelayedJob(values, result1 => {
                            if(result1.err){
                                return res.json(result1.err);
                            }
            
                            updateUIColorForKnowledgeBase(knowledge_base_id, () => {
                                recordHistory(
                                    "knowledgebase", 
                                    "update-knowledgebasecategory", 
                                    {
                                        knowledge_base_id: req.body.knowledge_base_id,
                                        category_id,
                                        kb_locale_id
                                        //user_identity
                                    }, 
                                    () => {
                                        return resolve({
                                            status: "success",
                                            message: "Knowledgebase category updated successfully"
                                        });
                                    }
                                );
                            });
                        });
                    }
                });
            });
        });
    });
}

module.exports = async (parents, args) => {
    return await getData(args);
}
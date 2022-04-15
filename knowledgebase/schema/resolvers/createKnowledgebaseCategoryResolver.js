const pgQueries = require('../../postgres/kb-queries');
const recordHistory = require('../resolverUtils/recordHistoryResolver');
const consts = require('../../consts');
const getNumberOfSubcategoriesArticlesAndCurrentLevelForCategoryId = require('../resolverUtils/getNumberOfSubcategoriesArticlesAndCurrentLevelForCategoryId');
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

        if(category_id == null){
            
            function createKnowledgeBaseCategory(){
                let values = [
                    knowledge_base_id ? knowledge_base_id : 1,
                    parent_id ? parent_id : -1,
                    position ? position: -1,
                    created_at ? created_at : new Date().toUTCString(),
                    updated_at ? updated_at : new Date().toUTCString()
                ];
        
                pgQueries.createKnowledgeBaseCategory(values, result=> {
                    if(result.err){
                        return res.json(result.err);
                    }
                    let kb = result.res;
                    category_id = kb.id;
        
                    createKnowledgeBaseCategoryTranslation(
                        resolve,
                        reject,
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
                        list_id,
                        kb
                    );
                });
            }

            if(parent_id == null || parent_id == -1){
                createKnowledgeBaseCategory();
            }else{
                getNumberOfSubcategoriesArticlesAndCurrentLevelForCategoryId(knowledge_base_id, parent_id, result => {
                    if(result.level <= 4){
                        createKnowledgeBaseCategory();
                    }else{
                        return reject({ status: "Not allowed", message: "Limit reached" });
                    }
                });
            }
        }else{
            pgQueries.listKnowledgeBaseCategoriesById(category_id, result => {
                if(result.err){
                    return reject(result.err);
                }

                if(result.res.length == 0) return reject({ status: 404, message: "Not found" });

                let kb = result.res[0];

                createKnowledgeBaseCategoryTranslation(
                    resolve,
                    reject,
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
                    list_id,
                    kb
                );
            });
        }
    });
}


function createKnowledgeBaseCategoryTranslation(
    resolve,
    reject,
    knowledge_base_id, 
    mkb_locale_id, 
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
    list_id,
    kb
){
    pgQueries.getKnowledgeBaseTranslationsByKnowledgeBaseId(knowledge_base_id, result => {
        if(result.err){
            result.err.errorIndex = 302;
            return reject(result.err);
        }

        let kb_translations = result.res;

        let numTranslations = kb_translations.length;
        let count = -1;

        kb_translations.forEach(kb_translation => {
            let kb_locale_id = kb_translation.kb_locale_id;
            
            let values = [
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
                false,
                false,
                knowledge_base_id
            ];

            if(kb_locale_id == mkb_locale_id){
                if(!active){
                    if(!publish_now){
                        values[5] = consts.STATUS_COLOR.publish_scheduled;
                    }else{
                        values[5] = consts.STATUS_COLOR.draft;
                    }
                }else{
                    if(!publish_now){
                        values[5] = consts.STATUS_COLOR.publish_scheduled;
                    }else{
                        values[5] = consts.STATUS_COLOR.published;
                    }
                }
            }else{
                values[5] = consts.STATUS_COLOR.pending_action;
            }

            pgQueries.createKnowledgeBaseCategoryTranslation(values, result => {
                if(result.err){
                    result.err.errorIndex = 302;
                    return reject(result.err);
                }
        
                let kb_category_translation_id = result.res.id;
        
                if(publish_now){
                    checkComplete();
                }else{
                    let run_at = schedule_at ? schedule_at : new Date().toUTCString();
        
                    let values3 = [
                        kb_category_translation_id,
                        run_at,
                        knowledge_base_id,
                        "publish"
                    ];
                    pgQueries.createKnowledgeBaseCategoryDelayedJob(values3, result1 => {
                        if(result1.err){
                            return reject(result1.err);
                        }
        
                        kb.schedule_at = result1.res.run_at; 
        
                        checkComplete();
                    });
                }
            });
        });

        checkComplete();

        function checkComplete(){
            count++;
            if(numTranslations == count){

                updateUIColorForKnowledgeBase(knowledge_base_id, () => {
                    recordHistory(
                        "knowledgebase", 
                        "create-knowledgebasecategory", 
                        {
                            knowledge_base_id: knowledge_base_id,
                            kb_locale_id: mkb_locale_id
                            //user_identity
                        }, 
                        () => {
                            resolve({
                                status: "success",
                                message: "Knowledgebase category created successfully"
                            });
                        }
                    );
                });
            }
        }
    });
}

module.exports = async (parents, args) => {
    return await getData(args);
}
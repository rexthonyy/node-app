const pgQueries = require('../../postgres/kb-queries');
const recordHistory = require('../resolverUtils/recordHistoryResolver');
const consts = require('../../consts');

const getData = ({
    knowledge_base_id, 
    kb_locale_id, 
    category_id, 
    article_id, 
    position, 
    created_at, 
    updated_at,
    title,
    body,
    keywords,
    title_tag,
    meta_description,
    active,
    publish_now,
    schedule_at,
    list_id
}) => {
    return new Promise((resolve, reject) => {
        
        // prevent the categories from being scheduled for publication at a time in the past
        if(!publish_now){
            if(schedule_at != null){
                let scheduled_date = new Date(schedule_at);
                if(scheduled_date.getTime() < Date.now()){
                    return reject({ status: "error", message: "You cannot schedule to publish an article in the past" });
                }
            }
        }

        let data = {
            knowledge_base_id: knowledge_base_id ? knowledge_base_id : 0,
            category_id: category_id ? category_id : -1,
            position: position ? position: -1,
            updated_at: updated_at ? updated_at: new Date().toUTCString(),
            created_at: created_at ? created_at: new Date().toUTCString()
        };

        pgQueries.updateKnowledgeBaseArticle(article_id, data, result => {
            if(result.err){
                result.err.errorIndex = 37487849;
                return reject(result.err);
            }
    
            let data1 =  {
                title: title ? title : "",
                kb_locale_id: kb_locale_id ? kb_locale_id : 0,
                category_id: category_id,
                knowledge_base_id: knowledge_base_id,
                created_at: created_at ? created_at: new Date().toUTCString(),
                updated_at: updated_at ? updated_at: new Date().toUTCString(),
                body: body ? body : "",
                keywords: keywords ? keywords : "",
                title_tag: title_tag ? title_tag : "",
                meta_description: meta_description ? meta_description : "",
                article_id: article_id ? article_id : -1,
                active: active ? active : true,
                publish_now: publish_now ? publish_now : true,
                is_delete_scheduled: false,
                is_update_scheduled: false,
                list_id: list_id ? list_id : 1
            };

            if(!active){
                if(!publish_now){
                    data1.ui_color = consts.STATUS_COLOR.update_scheduled;
                }else{
                    data1.ui_color = consts.STATUS_COLOR.draft;
                }
            }else{
                data1.ui_color = consts.STATUS_COLOR.published;
            }
    
            pgQueries.updateKnowledgeBaseArticleTranslation(article_id, kb_locale_id, data1, result1 => {
                if(result1.err){
                    result1.err.errorIndex = 83782;
                    return reject(result1.err);
                }
    
                let knowledge_base_article_translation = result1.res;
                let knowledge_base_article_translation_id = knowledge_base_article_translation.id;
    
                pgQueries.deleteKnowledgeBaseArticleDelayedJob([knowledge_base_article_translation_id], result2 => {
                    if(result2.err){
                        return res.json(result2.err);
                    }
        
                    recordHistory(
                        "knowledgebase", 
                        "update-knowledgebasearticle", 
                        {
                            article_id,
                            kb_locale_id
                            //user_identity
                        }, 
                        () => {
                            if(publish_now){
                                resolve({
                                    status: "success",
                                    message: "Article updated successfully"
                                });
                            }else{
                                let translation_id = knowledge_base_article_translation_id.id;
                                let run_at = schedule_at ? new Date(schedule_at).toUTCString() : new Date().toUTCString();
            
                                let values3 = [
                                    knowledge_base_id,
                                    article_id,
                                    translation_id,
                                    run_at,
                                    "publish"
                                ];
                                pgQueries.createKnowledgeBaseArticleDelayedJob(values3, result3 => {
                                    if(result3.err){
                                        return reject(result3.err);
                                    }
                        
                                    resolve({
                                        status: "success",
                                        message: "Article updated successfully"
                                    });
                                });
                            }
                        }
                    );
    
                });
            });
        });
    });
}

module.exports = async (parents, args) => {
    return getData(args);
}
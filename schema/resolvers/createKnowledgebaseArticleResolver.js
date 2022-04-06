const pgQueries = require('../../postgres/kb-queries');
const recordHistory = require('../resolverUtils/recordHistoryResolver');
const consts = require('../../consts');
const updateUIColorForKnowledgeBase = require('../resolverUtils/updateUIColorForKnowledgeBase');

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
        
        console.log("knowledge_base_id:" + knowledge_base_id);
        console.log("kb_locale_id:" + kb_locale_id);
        console.log("category_id:" + category_id);
        console.log("article_id:" + article_id);
        console.log("position:" + position);
        console.log("created_at:" + created_at);
        console.log("updated_at:" + updated_at);
        console.log("title:" + title);
        console.log("body:" + body);
        console.log("keywords:" + keywords);
        console.log("title_tag:" + title_tag);
        console.log("meta_description:" + meta_description);
        console.log("active:" + active);
        console.log("publish_now:" + publish_now);
        console.log("schedule_at:" + schedule_at);
        console.log("list_id:" + list_id);
        if(!publish_now){
            if(schedule_at != null){
                let scheduled_date = new Date(schedule_at);
                if(scheduled_date.getTime() < Date.now()){
                    return reject({ status: "error", message: "You cannot schedule to publish an article in the past" });
                }
            }
        }
    
        if(article_id == null){
            let data = {
                knowledge_base_id: knowledge_base_id ? knowledge_base_id : 0,
                category_id: category_id ? category_id : -1,
                position: position ? position: -1,
                updated_at: updated_at ? updated_at: new Date().toUTCString(),
                created_at: created_at ? created_at: new Date().toUTCString()
            };
            pgQueries.createKnowledgeBaseArticle(data, result => {
                if(result.err){
                    result.err.errorIndex = 3847322;
                    return reject(result.err);
                }
    
                let article = result.res;
    
                article_id = article.id;
    
                createKnowledgeBaseArticleTranslation(
                    resolve,
                    reject,
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
                    list_id,
                    article
                );
            });
        }else{
            pgQueries.getKnowledgeBaseArticlesById(article_id, result => {
                if(result.err){
                    result.err.errorIndex = 3847322;
                    return reject(result.err);
                }
    
                if(result.res.length == 0) return reject({ status: 404, message: "Article not found" });
    
                let article = result.res[0];
    
                article_id = article.id;
    
                createKnowledgeBaseArticleTranslation(
                    resolve,
                    reject,
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
                    list_id,
                    article
                );
            });
        }
    });
}


function createKnowledgeBaseArticleTranslation(
    resolve,
    reject,
    knowledge_base_id, 
    mkb_locale_id, 
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
    list_id,
    article
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

            let data = {
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
                is_delete_scheduled: is_delete_scheduled ? is_delete_scheduled : false,
                is_update_scheduled: is_update_scheduled ? is_update_scheduled : false,
                list_id: list_id ? list_id : 1
            };

            if(kb_locale_id == mkb_locale_id){
                if(!active){
                    if(!publish_now){
                        data.ui_color = consts.STATUS_COLOR.update_scheduled;
                    }else{
                        data.ui_color = consts.STATUS_COLOR.draft;
                    }
                }else{
                    data.ui_color = consts.STATUS_COLOR.published;
                }
            }else{
                data.ui_color = consts.STATUS_COLOR.pending_action;
            }
            pgQueries.createKnowledgeBaseArticleTranslation(data, result => {
                if(result.err){
                    result.err.errorIndex = 2847322;
                    return reject(result.err.errorIndex);
                }
        
                let articleTranslation = result.res;
        
                recordHistory(
                    "knowledgebase", 
                    "create-knowledgebasearticle", 
                    {
                        knowledge_base_id: knowledge_base_id,
                        kb_locale_id: kb_locale_id,
                        title: title
                        //user_identity
                    }, 
                    () => {
                        if(publish_now){
                            checkComplete();
                        }else{
                            let knowledge_base_id = knowledge_base_id;
                            let article_id = article_id;
                            let translation_id = articleTranslation.id;
                            let run_at = schedule_at ?? new Date().toUTCString();
                
                            let values3 = [
                                knowledge_base_id,
                                article_id,
                                translation_id,
                                run_at,
                                "publish"
                            ];
                            pgQueries.createKnowledgeBaseArticleDelayedJob(values3, result1 => {
                                if(result1.err){
                                    return reject(result1.err);
                                }
                
                                articleTranslation.schedule_at = result1.res.run_at; 
                
                                checkComplete();
                            });
                        }
                    }
                );
            });
        });

        checkComplete();

        function checkComplete(){
            count++;
            if(numTranslations == count){
                updateUIColorForKnowledgeBase(knowledge_base_id, () => {
                    resolve({
                        status: "success",
                        message: "Article created successfully"
                    });
                });
            }
        }
    });
}

module.exports = async (parents, args) => {
    let result = await getData(args)
    return result;
}
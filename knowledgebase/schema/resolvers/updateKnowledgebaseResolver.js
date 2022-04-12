const pgQueries = require('../../postgres/kb-queries');
const updateUIColorForKnowledgeBase = require('../resolverUtils/updateKnowledgebaseUIColor');
const recordHistory = require('../resolverUtils/recordHistoryResolver');
const getLanguageTitleFromLocaleId = require('../resolverUtils/getLanguageTitleFromLocaleId');
const consts = require('../../consts');

const getData = ({knowledge_base_id, name, icon, footer, homepage_layout, category_layout, active, front_page, kb_locale_ids}) => {
    return new Promise((resolve, reject) => {
        
        if(kb_locale_ids.length == 0) return reject(JSON.stringify({ status: "error", message: "Not allowed, please provide a language selection for this knowledgebase"}));

        let data = {
            id: knowledge_base_id,
            name,
            icon,
            footer,
            homepage_layout,
            category_layout,
            active,
            front_page,
            updated_at: new Date().toUTCString()
        };
    
        pgQueries.updateKnowledgeBase(data, result => {
            if(result.err){
                result.err.errorIndex = 32;
                return reject(result.err);
            }
    
            pgQueries.deleteKnowledgeBaseTranslationByKnowledgeBaseId(knowledge_base_id, result1 => {
                if(result1.err){
                    return reject(result1.err);
                }
    
                let numIds = kb_locale_ids.length;
                let count = -1;
    
                for(let i = 0; i < kb_locale_ids.length; i++){
                    let kb_locale_id = kb_locale_ids[i];
                    let position = i+1;
        
                    getLanguageTitleFromLocaleId(kb_locale_id.id, title => {
                        pgQueries.createKnowledgeBaseTranslation({
                            title: title,
                            footer_note: "",
                            kb_locale_id: kb_locale_id.id,
                            knowledge_base_id: knowledge_base_id,
                            active: kb_locale_id.default,
                            position: position,
                            ui_color: consts.STATUS_COLOR.pending_action
                        }, result2 => {
                            if(result2.err){
                                result1.err.errorIndex = -2;
                                return reject(result2.err);
                            }
            
                            checkComplete();
                        });
                    });
                }
        
                checkComplete();
                
                function checkComplete(){
                    count++;
                    if(count == numIds){
                        count = -1;
                        let numKb_locale_ids = kb_locale_ids.length;
    
                        let new_locale_ids = [];
                        let reference_category_translations = [];
                        let reference_article_translations = [];
    
                        kb_locale_ids.forEach(locale => {
                            // get all categories
                            pgQueries.getKnowledgeBaseCategoryTranslationsByKnowledgeBaseIdAndLocaleId([knowledge_base_id, locale.id], result => {
                                let category_translations = result.res;
                                pgQueries.getKnowledgeBaseArticleTranslationByKnowledgeBaseIdAndLocaleId([knowledge_base_id, locale.id], result => {
                                    let article_translations = result.res;
    
                                    if(category_translations.length == 0 && article_translations.length == 0){
                                        new_locale_ids.push(locale.id);
                                    }else{
                                        reference_locale_id = locale.id;
                                        reference_category_translations = category_translations;
                                        reference_article_translations = article_translations;
                                    }
                                    checkComplete2();
                                });
                            });
                        });
    
                        checkComplete2();
    
                        function checkComplete2(){
                            count++;
                            if(count == numKb_locale_ids){
                                count = -1;
                                let num_new_kb_locale_ids = new_locale_ids.length;
    
                                new_locale_ids.forEach(locale_id => {
                                    // add categories
                                    let cat_count = -1;
                                    let num_cat_translations = reference_category_translations.length;
    
                                    reference_category_translations.forEach(cat => {
                                        let values = [
                                            cat.name,
                                            locale_id,
                                            cat.category_id,
                                            new Date().toUTCString(),
                                            new Date().toUTCString(),
                                            consts.STATUS_COLOR.pending_action,
                                            cat.category_icon,
                                            cat.title_tag,
                                            cat.footer,
                                            cat.keywords,
                                            cat.meta_description,
                                            true,
                                            false,
                                            cat.permission,
                                            cat.list_id,
                                            false,
                                            false,
                                            cat.knowledge_base_id
                                        ];
        
                                        pgQueries.createKnowledgeBaseCategoryTranslation(values, result => {
                                            checkCatComplete();
                                        });
                                    });
    
                                    checkCatComplete();
    
                                    function checkCatComplete(){
                                        cat_count++;
                                        if(cat_count == num_cat_translations){
                                            // add articles
                                            let art_count = -1;
                                            let num_art_translations = reference_article_translations.length;
    
                                            reference_article_translations.forEach(art => {
                                                let data = {
                                                    title: art.title,
                                                    kb_locale_id: locale_id,
                                                    created_at: new Date().toUTCString(),
                                                    updated_at: new Date().toUTCString(),
                                                    body: art.body,
                                                    keywords: art.keywords,
                                                    title_tag: art.title_tag,
                                                    meta_description: art.meta_description,
                                                    article_id: art.article_id,
                                                    active: false,
                                                    publish_now: true,
                                                    is_delete_scheduled: false,
                                                    is_update_scheduled: false,
                                                    category_id: art.category_id,
                                                    ui_color: consts.STATUS_COLOR.pending_action,
                                                    list_id: art.list_id,
                                                    knowledge_base_id: art.knowledge_base_id
                                                };
                
                                                pgQueries.createKnowledgeBaseArticleTranslation(data, result => {
                                                    checkComplete3();
                                                });
                                            });
    
                                            checkArtComplete();
    
                                            function checkArtComplete(){
                                                art_count++;
                                                if(art_count == num_art_translations){
                                                    checkComplete3();
                                                }
                                            }
                                        }
                                    }
                                });
    
                                checkComplete3();
    
                                function checkComplete3(){
                                    count++;
                                    if(count == num_new_kb_locale_ids){
                                        updateUIColorForKnowledgeBase(knowledge_base_id, () => {
                                            recordHistory(
                                                "knowledgebase", 
                                                "update-knowledgebase", 
                                                {
                                                    knowledge_base_id,
                                                    name: name,
                                                    //user_id,
                            
                                                }, 
                                                () => {
                                                    resolve({ status: "success", message: "Knowledge base updated successfully" });
                                                }
                                            );
                                        });
                                    }
                                }
    
                            }
                        }
                    }
                }
            });
        });
    });
}

module.exports = async (parents, args) => {
    let result = await getData(args)
    return result;
}
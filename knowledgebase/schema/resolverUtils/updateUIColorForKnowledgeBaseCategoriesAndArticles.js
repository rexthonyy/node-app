const pgQueries = require('../../postgres/kb-queries');
const consts = require('../../consts');

let updateUIColorForKnowledgeBaseCategoriesAndArticles = (knowledge_base_id, category_id, cb) => {
    // get knowledge base category details
    pgQueries.getKnowledgeBaseCategoryTranslationsByKnowledgeBaseIdAndCategoryId([knowledge_base_id, category_id], result => {
        let category_translations = result.res;
        let num_category_translations = category_translations.length;
        let count = -1;

        category_translations.forEach(translation => {
            let publish_now = translation.publish_now;
            let active = translation.active;
            let archived = translation.is_archived;
            let is_delete_scheduled = translation.is_delete_scheduled;
            let is_update_scheduled = translation.is_update_scheduled;

            let ui_color;

            if(active){
                if(publish_now){
                    ui_color = consts.STATUS_COLOR.published;
                }else{
                    ui_color = consts.STATUS_COLOR.publish_scheduled;
                }
            }else{
                if(!publish_now){
                    ui_color = consts.STATUS_COLOR.publish_scheduled;
                }else{
                    ui_color = consts.STATUS_COLOR.draft;
                }
            }
            
            if(archived){
                ui_color = consts.STATUS_COLOR.archived;
            }else{
                if(is_delete_scheduled){
                    ui_color = consts.STATUS_COLOR.archive_scheduled;
                }else if(is_update_scheduled){
                    ui_color = consts.STATUS_COLOR.update_scheduled;
                }
            }

            pgQueries.updateKnowledgeBaseCategoryTranslationsUIColor([translation.id, ui_color], result1 => {
                checkComplete();
            });
        });

        checkComplete();

        function checkComplete(){
            count++;
            if(count == num_category_translations){
                pgQueries.getKnowledgeBaseArticleTranslationsByKnowledgeBaseIdAndCategoryId([knowledge_base_id, category_id], result1 => {
                    let article_translations = result1.res;
                    let num_article_translations = article_translations.length;
                    count = -1;

                    article_translations.forEach(translation => {
                        publish_now = translation.publish_now;
                        active = translation.active;
                        archived = translation.is_archived;
                        is_delete_scheduled = translation.is_delete_scheduled;
                        is_update_scheduled = translation.is_update_scheduled;
            
                        ui_color = consts.STATUS_COLOR.pending_action;
            
                        if(active){
                            if(publish_now){
                                ui_color = consts.STATUS_COLOR.published;
                            }else{
                                ui_color = consts.STATUS_COLOR.publish_scheduled;
                            }
                        }else{
                            if(!publish_now){
                                ui_color = consts.STATUS_COLOR.publish_scheduled;
                            }else{
                                ui_color = consts.STATUS_COLOR.draft;
                            }
                        }
                        
                        if(archived){
                            ui_color = consts.STATUS_COLOR.archived;
                        }else{
                            if(is_delete_scheduled){
                                ui_color = consts.STATUS_COLOR.archive_scheduled;
                            }else if(is_update_scheduled){
                                ui_color = consts.STATUS_COLOR.update_scheduled;
                            }
                        }
            
                        pgQueries.updateKnowledgeBaseArticleTranslationsUIColor([translation.id, ui_color], result2 => {
                            checkComplete1();
                        });
                    });

                    checkComplete1();

                    function checkComplete1(){
                        count++;
                        if(count == num_article_translations){
                            cb();
                        }
                    }
                });
            }
        }
    });
}

module.exports = updateUIColorForKnowledgeBaseCategoriesAndArticles;
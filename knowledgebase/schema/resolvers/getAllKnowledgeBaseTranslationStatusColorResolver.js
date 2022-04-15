const pgQueries = require('../../postgres/kb-queries');
const consts = require('../../consts');

const getData = ({filter_by, knowledge_base_id, category_id}) => {
    return new Promise((resolve, reject) => {
        
        if(!["article","category"].find(filterWith => filterWith == filter_by)) return reject({status:"error", message: "Please enter either 'article' or 'category' for filter_by"});

        // get the category whose status we want to analyze
        pgQueries.getKnowledgeBaseCategoriesByKnowledgeBaseIdAndParentId(knowledge_base_id, category_id, result => {
            if(result.err){
                result.err.errorIndex = 100;
                return reject(result.err);
            }


            if(result.res.length == 0) {
                result.res = [];
            }

            let categories = result.res;
            
            pgQueries.getKnowledgeBaseTranslationsByKnowledgeBaseId(knowledge_base_id, result => {
                if(result.err){
                    result.err.errorIndex = 200;
                    return reject(result.err);
                }

                let kb_translations = result.res;
                let num_translations = kb_translations.length;
                let count = -1;

                let kb_status_color_translations = [];

                kb_translations.forEach(translation => {
                    let num_categories = categories.length;
                    let count1 = -1;

                    let active_colors = [];

                    categories.forEach(category => {
                        if(filter_by == "category"){
                            pgQueries.getKnowledgeBaseCategoryTranslationsByKnowledgeBaseIdCategoryIdAndLocaleId([knowledge_base_id, category.id, translation.kb_locale_id], result => {
                                if(result.res == null || result.res.length==0) return checkComplete1();
                                active_colors.push(result.res[0].ui_color);
                                checkComplete1();
                            });
                        }else{
                            pgQueries.getKnowledgeBaseArticleTranslationsByKnowledgeBaseIdCategoryIdAndLocaleId([knowledge_base_id, category.id, translation.kb_locale_id], result => {
                                if(result.res == null || result.res.length==0) return checkComplete1();
                                active_colors.push(result.res[0].ui_color);
                                checkComplete1();
                            });
                        }
                    });

                    checkComplete1();
                    function checkComplete1(){
                        count1++;
                        if(count1 == num_categories){
                            //apply logic to get the main color for this translation
                            let primary_color = consts.STATUS_COLOR.pending_action;

                            let numRed = 0;
                            let numOrange = 0;
                            let numGreen = 0;
                            let numBlue = 0;
                            let numGray = 0;
                            let numYellow = 0;
                            let numWhite = 0;

                            active_colors.forEach(ui_color => {
                                // logic goes here
                                switch(ui_color){
                                    case consts.STATUS_COLOR.pending_action:
                                        numRed++;
                                    break;
            
                                    case consts.STATUS_COLOR.draft:
                                        numOrange++;
                                    break;
            
                                    case consts.STATUS_COLOR.published:
                                        numGreen++;
                                    break;
            
                                    case consts.STATUS_COLOR.publish_scheduled:
                                        numBlue++;
                                    break;
            
                                    case consts.STATUS_COLOR.archived:
                                        numGray++;
                                    break;
            
                                    case consts.STATUS_COLOR.archive_scheduled:
                                        numYellow++;
                                    break;
            
                                    case consts.STATUS_COLOR.update_scheduled:
                                        numWhite++;
                                    break;
                                }
                            });

                            if(numOrange == num_categories){
                                primary_color = consts.STATUS_COLOR.draft;
                            }

                            if(numGreen == num_categories){
                                primary_color = consts.STATUS_COLOR.published;
                            }

                            if(numBlue == num_categories){
                                primary_color = consts.STATUS_COLOR.publish_scheduled;
                            }

                            if(numGray == num_categories){
                                primary_color = consts.STATUS_COLOR.archived;
                            }

                            if(numRed == num_categories){
                                primary_color = consts.STATUS_COLOR.pending_action;
                            }

                            if(numGreen > 0){
                                primary_color = consts.STATUS_COLOR.published;
                            }

                            if(numGray > 0){
                                primary_color = consts.STATUS_COLOR.archived;
                            }

                            if(numBlue > 0){
                                primary_color = consts.STATUS_COLOR.publish_scheduled;
                            }

                            if(numYellow > 0){
                                primary_color = consts.STATUS_COLOR.archive_scheduled;
                            }

                            if(numWhite > 0){
                                primary_color = consts.STATUS_COLOR.update_scheduled;
                            }

                            if(numOrange > 0){
                                primary_color = consts.STATUS_COLOR.draft;
                            }

                            if(numRed > 0){
                                primary_color = consts.STATUS_COLOR.pending_action;
                            }

                            kb_status_color_translations.push({
                                kb_locale_id: translation.kb_locale_id,
                                knowledge_base_translation_id: translation.id,
                                ui_color: primary_color,
                                tooltip: consts.STATUS_COLOR_TEXT[primary_color],
                                title: translation.title,
                                default: translation.active
                            });

                            checkComplete();
                        }
                    }
                });

                checkComplete();

                function checkComplete(){
                    count++;
                    if(count == num_translations){
                        return resolve(kb_status_color_translations);
                    }
                }
            });
        });
    });
}

module.exports = async (parents, args) => {
    return await getData(args);
}
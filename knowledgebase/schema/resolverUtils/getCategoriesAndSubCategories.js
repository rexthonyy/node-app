const pgQueries = require('../../postgres/kb-queries');
const getNumberOfSubcategoriesArticlesAndCurrentLevelForCategoryId = require('./getNumberOfSubcategoriesArticlesAndCurrentLevelForCategoryId');
const util = require('../../util');

let getCategoriesAndSubCategories = (knowledge_base_id, kb_locale_id, parent_id, cb) => {
    pgQueries.getKnowledgeBaseCategoriesByKnowledgeBaseIdAndParentId(knowledge_base_id, parent_id, result => {
        if(result.err){
            return cb([]);
        }
    
        let kb_category_translations = [];
    
        let kbCategories = result.res;
        let numCategories = kbCategories.length;
        let count = -1;
    
        kbCategories.forEach(kbCategory => {
            pgQueries.getKnowledgeBaseCategoryTranslationsByCategoryIdAndLocaleId(kbCategory.id, kb_locale_id, result2 => {
                if(result2.err){
                    return checkComplete();
                }
    
                if(result2.res.length == 0){
                    checkComplete();
                }else{
                    let kbCategoryTranslation = result2.res[0];

                    kbCategoryTranslation.position = kbCategory.position;
                    kbCategoryTranslation.parent_id = parent_id;
                    kbCategoryTranslation.schedule_at = null;

                    getNumberOfSubcategoriesArticlesAndCurrentLevelForCategoryId(knowledge_base_id, kbCategory.id, result => {
                        kbCategoryTranslation.stat = {
                            level: result.level,
                            num_categories: result.num_categories,
                            num_articles: result.num_articles
                        };

                        if(kbCategoryTranslation.publish_now){
                            kb_category_translations.push(kbCategoryTranslation);
                            checkComplete();
                        }else{
                            pgQueries.getKnowledgeBaseCategoryDelayedJobByKnowledgeBaseCategoryTranslationId(kbCategoryTranslation.id, result1 => {
                                if(result1.err){
                                    return checkComplete();
                                }
                
                                kbCategoryTranslation.schedule_at = null;
                                if(result1.res.length > 0){
                                    kbCategoryTranslation.schedule_at = result1.res[0].run_at;
                                }
                                kb_category_translations.push(kbCategoryTranslation);
        
        
                                checkComplete();
                            });
                        }
                    });
        
                }
            });
        });
    
        checkComplete();
    
        function checkComplete(){
            count++;
            if(count == numCategories){
                kb_category_translations.sort(util.sortByPosition);
                let numCategoryTrans = kb_category_translations.length;
                count = -1;
                kb_category_translations.forEach(kbCategoryTrans => {
                    let category_id = kbCategoryTrans.category_id;
                    getCategoriesAndSubCategories(knowledge_base_id, kb_locale_id, category_id, categories => {
                        kbCategoryTrans.subcategories = [];
                        if(categories.length > 0){
                            kbCategoryTrans.subcategories = categories;
                        }
                        checkComplete2();
                    });
                });

                checkComplete2();

                function checkComplete2(){
                    count++;
                    if(count == numCategoryTrans){
                        cb(kb_category_translations);
                    }
                }
            }
        }
    });
};

module.exports = getCategoriesAndSubCategories;
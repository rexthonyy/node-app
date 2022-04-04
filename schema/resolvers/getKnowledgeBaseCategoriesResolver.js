const pgQueries = require('../../postgres/kb-queries');
const util = require('../../util');
const getCategoriesAndSubCategories = require('../resolverUtils/getCategoriesAndSubCategories');
const getCategoriesAtLevel = require('../resolverUtils/getCategoriesAtLevel');
const getNumberOfSubcategoriesArticlesAndCurrentLevelForCategoryId = require('../resolverUtils/getNumberOfSubcategoriesArticlesAndCurrentLevelForCategoryId');

const getData = ({ knowledge_base_id, kb_locale_id, level, parent_id }) => {
    return new Promise((resolve, reject) => {
        console.log("knowledge base id: " + knowledge_base_id);
        console.log("locale id: " + kb_locale_id);
        console.log("level: " + level);
        console.log("parent id: " + parent_id);

        if(level != null){
            if(level > 5 || level < 1) return reject(JSON.stringify({ status: "error", message: "The level must be between 1 and 5"}));
    
            getCategoriesAndSubCategories(knowledge_base_id, kb_locale_id, -1, tree => {
                //filter the result bashed on the level
                let index = 1;
                
                getCategoriesAtLevel(tree, level, index, level_categories => {
                    level_categories.sort(util.sortByPosition);
                    level_categories = filterOutArchive(level_categories);
                    let result = [];
                    console.log(result);
                    return resolve(result);
                });
            });
        }else{
            pgQueries.getKnowledgeBaseCategoriesByKnowledgeBaseIdAndParentId(knowledge_base_id, parent_id, result => {
                if(result.err){
                    result.err.errorIndex = "abx";
                    return reject(result.err);
                }
        
                let kb_category_translations = [];
        
                let kbCategories = result.res;
                
                let numCategories = kbCategories.length;
                let count = -1;
        
                kbCategories.forEach(kbCategory => {
                    pgQueries.getKnowledgeBaseCategoryTranslationsByCategoryIdAndLocaleId(kbCategory.id, kb_locale_id, result2 => {
                        if(result2.err){
                            result2.err.errorIndex = 322;
                            return reject(result2.err);
                        }
        
                        if(result2.res.length == 0){
                            checkComplete();
                        }else{
                            let kbCategoryTranslation = result2.res[0];
        
                            kbCategoryTranslation.position = kbCategory.position;
        
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
                                            result1.err.errorIndex = 3220;
                                            return res.json(result1.err);
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
                        console.log(kb_category_translations);
                        kb_category_translations.sort(util.sortByPosition);
                        kb_category_translations = filterOutArchive(kb_category_translations);
                        resolve(kb_category_translations);
                    }
                }
            });
        }
    });
}

function filterOutArchive(obj){
    let new_obj = [];
    obj.forEach(cat => {
        if(!cat.is_archived){
            new_obj.push(cat);
        }
    });
    return new_obj;
}

module.exports = async (parents, args) => {
    let result = await getData(args);
    return result;
}
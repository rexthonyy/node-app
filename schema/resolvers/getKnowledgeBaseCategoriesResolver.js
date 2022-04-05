const pgQueries = require('../../postgres/kb-queries');
const util = require('../../util');
const getCategoriesAndSubCategories = require('../resolverUtils/getCategoriesAndSubCategories');
const getCategoriesAtLevel = require('../resolverUtils/getCategoriesAtLevel');
const getNumberOfSubcategoriesArticlesAndCurrentLevelForCategoryId = require('../resolverUtils/getNumberOfSubcategoriesArticlesAndCurrentLevelForCategoryId');

const getData = ({ knowledge_base_id, kb_locale_id, level, parent_id }) => {
    return new Promise((resolve, reject) => {

        if(level != null){
            if(level > 5 || level < 1) return reject(JSON.stringify({ status: "error", message: "The level must be between 1 and 5"}));
    
            getCategoriesAndSubCategories(knowledge_base_id, kb_locale_id, -1, tree => {
                //filter the result bashed on the level
                let index = 1;
                
                getCategoriesAtLevel(tree, level, index, level_categories => {
                    level_categories.sort(util.sortByPosition);
                    level_categories = filterOutArchive(level_categories);
                    resolveResponse(resolve, level_categories);
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
                                            return reject(JSON.stringify(result1.err));
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
                        kb_category_translations = filterOutArchive(kb_category_translations);
                        resolveResponse(resolve, kb_category_translations);
                    }
                }
            });
        }
    });
}

function resolveResponse(resolve, level_categories){
    let response_data = [];

    level_categories.forEach(cat => {
        response_data.push({
            knowledge_base_category: {
                knowledge_base_category: {
                    id: cat.category_id,
                    knowledge_base_id: cat.knowledge_base_id,
                    parent_id: cat.parent_id,
                    position: cat.position,
                    created_at: cat.created_at,
                    updated_at: cat.updated_at,
                    is_archived: cat.is_archived,
                },
                knowledge_base_category_translation: {
                    id: cat.id,
                    name: cat.name,
                    kb_locale_id: cat.kb_locale_id,
                    category_id: cat.category_id,
                    created_at: cat.created_at,
                    updated_at: cat.updated_at,
                    ui_color: cat.ui_color,
                    category_icon: cat.category_icon,
                    title_tag: cat.title_tag,
                    footer: cat.footer,
                    keywords: cat.keywords,
                    meta_description: cat.meta_description,
                    publish_now: cat.publish_now,
                    active: cat.active,
                    permission: cat.permission,
                    update_metadata: cat.update_metadata,
                    is_delete_scheduled: cat.is_delete_scheduled,
                    is_update_scheduled: cat.is_update_scheduled,
                    knowledge_base_id: cat.knowledge_base_id,
                    is_archived: cat.is_archived,
                    list_id: cat.list_id
                }
            },
            stat: cat.stat
        });
    });

    resolve(response_data);
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
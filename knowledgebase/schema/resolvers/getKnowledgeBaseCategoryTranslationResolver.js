const pgQueries = require('../../postgres/kb-queries');
const util = require('../../util');
const consts = require('../../consts');
const getCategoriesAndSubCategories = require('../resolverUtils/getCategoriesAndSubCategories');
const getCategoriesAtLevel = require('../resolverUtils/getCategoriesAtLevel');
const getNumberOfSubcategoriesArticlesAndCurrentLevelForCategoryId = require('../resolverUtils/getNumberOfSubcategoriesArticlesAndCurrentLevelForCategoryId');
const getParentCategoryName = require('../resolverUtils/getParentCategoryName');

const getData = ({ category_id, kb_locale_id }) => {
    return new Promise((resolve, reject) => {

        pgQueries.listKnowledgeBaseCategoriesById(category_id, result1 => {
            if(result1.err){
                result1.err.errorIndex = 484733;
                return reject(result1.err);
            }
    
            let category = result1.res[0];

            if(category == null) return reject({status: "error", message: "Category not found"});
    
            pgQueries.getKnowledgeBaseCategoryTranslationByCategoryIdAndLocaleId(category_id, kb_locale_id, result => {
                if(result.err){
                    return reject(result.err);
                }
        
                if(result.res.length == 0) return reject({ status: 404, message: "Not found" });
        
                let translation = result.res[0];
                translation.tooltip = consts.STATUS_COLOR_TEXT[translation.ui_color];
                translation.parent_id = category.parent_id;
                translation.knowledge_base_id = category.knowledge_base_id;
                translation.position = category.position;
    
                getNumberOfSubcategoriesArticlesAndCurrentLevelForCategoryId(category.knowledge_base_id, category.id, result1 => {
                    translation.stat = {
                        level: result1.level,
                        num_categories: result1.num_categories,
                        num_articles: result1.num_articles
                    };
                    resolveResponse(resolve, translation);
                });
                
            });
        });
    });
}

function resolveResponse(resolve, cat){
    getParentCategoryName(cat.parent_id, cat.kb_locale_id, name => {
        resolve({
            data: {
                info: {
                    parent_name: name
                },
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
}

module.exports = async (parents, args) => {
    return await getData(args);
}
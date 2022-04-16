const pgQueries = require('../../postgres/kb-queries');
const consts = require('../../consts');
const updateUIColorForKnowledgeBaseCategoriesAndArticles = require('../resolverUtils/updateUIColorForKnowledgeBaseCategoriesAndArticles');

const getData = ({category_id}) => {
    return new Promise((resolve, reject) => {
        
        pgQueries.listKnowledgeBaseCategoriesById(category_id, result => {
            if(result.res.length == 0) return reject({status: "error", message: "Category not found"});
            let category = result.res[0];
            let knowledge_base_id = category.knowledge_base_id;
            if(category.parent_id == -1){
                pgQueries.listKnowledgeBasesById(knowledge_base_id, result1 => {
                    if(result1.res.length == 0) return reject(JSON.stringify({status: "error", message: "Knowledge base not found"}));

                    let kb = result1.res[0];
    
                    if(kb == null || kb.is_archived){
                        // check if the knowledge base is archived
                        reject(JSON.stringify({ status: "error", message: "The knowledge base is already archived or is unavailable"}));
                    }else{
                        unarchiveSubCategory(knowledge_base_id, category_id, () => {
                            resolve({ status: "success", message: "Successfully unarchived"});
                        });
                    }
                });
            }else{
                pgQueries.listKnowledgeBaseCategoriesById(category.parent_id, result1 => {
                    if(result1.res.length == 0) return reject({status: "error", message: "Category not found"});
                    let parent_category = result1.res[0];
                    if(parent_category == null || parent_category.is_archived){
                        return reject({ status: "error", message: "The parent is already archived or is unavailable"});
                    }else{
                        // the parent is not archived
                        unarchiveSubCategory(knowledge_base_id, category_id, () => {
                            resolve({ 
                                status: "success", 
                                message: "Successfully unarchived"
                            });
                        });
                    }
                });
            }
        });
    });
}


function unarchiveSubCategory(knowledge_base_id, category_id, cb){
    let values1 = [
        category_id,
        false
    ];

    let values2 = [
        category_id,
        false,
        consts.STATUS_COLOR.pending_action
    ];
    
    pgQueries.updateKnowledgeBaseCategoriesArchivedStatusByCategoryId(values1, result => {
        pgQueries.updateKnowledgeBaseCategoryTranslationsArchivedStatusByCategoryId(values2, result1 => {
            pgQueries.updateKnowledgeBaseArticlesArchivedStatusByCategoryId(values1, result2 => {
                pgQueries.updateKnowledgeBaseArticleTranslationsArchivedStatusByCategoryId(values2, result3 => {
                    
                    updateUIColorForKnowledgeBaseCategoriesAndArticles(knowledge_base_id, category_id, () => {
                        //determine if there are sub categories to this category
                        pgQueries.getKnowledgeBaseCategoriesByParentId(category_id, result4 => {
                            if(result4.res.length == 0) return cb();
    
                            let categories = result4.res;
                            let numCategories = categories.length;
                            let count = -1;
    
                            categories.forEach(category => {
                                unarchiveSubCategory(knowledge_base_id, category.id, () => {
                                    checkComplete();
                                });
                            });
    
                            checkComplete();
    
                            function checkComplete(){
                                count++;
                                if(count == numCategories){
                                    cb();
                                }
                            }
                        });
                    });
                });
            });
        });
    });
}

module.exports = async (parents, args) => {
    return getData(args);
}
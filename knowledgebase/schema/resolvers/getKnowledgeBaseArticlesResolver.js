const pgQueries = require('../../postgres/kb-queries');
const consts = require('../../consts');
const util = require('../../util');
const getCategoriesAndSubCategories = require('../resolverUtils/getCategoriesAndSubCategories');
const getCategoriesAtLevel = require('../resolverUtils/getCategoriesAtLevel');

const getData = ({ knowledge_base_id, category_id, kb_locale_id, parent_id, level }) => {
    return new Promise((resolve, reject) => {

        if(level != null){
            if(level > 5 || level < 1) return reject({ status: "error", message: "The level must be between 1 and 5"});
    
            getCategoriesAndSubCategories(knowledge_base_id, kb_locale_id, -1, tree => {
                //filter the result bashed on the level
                let index = 1;
                // level = 2, index = 1
                getCategoriesAtLevel(tree, level, index, level_categories => {
    
                    // get the articles from this list
                    let num_level_categories = level_categories.length;
                    let count = -1;
        
                    let articles = [];
        
                    level_categories.forEach(category => {
                        pgQueries.getKnowledgeBaseArticleTranslationsByKnowledgeBaseIdCategoryIdAndLocaleId([knowledge_base_id, category.category_id, kb_locale_id], result => {
        
                            if(result.res == null || result.res.length == 0){
                                checkComplete();
                            }else{
                                articles = articles.concat(result.res);
                                checkComplete();
                            }
                        });
                    });
        
                    checkComplete();
        
                    function checkComplete(){
                        count++;
                        if(count == num_level_categories){
                            articles.forEach(article => {
                                article.tooltip = consts.STATUS_COLOR_TEXT[article.ui_color];
                            });
                            
                            resolve(articles);
                        }
                    }
                });
            });
        }else{
            pgQueries.getKnowledgeBaseArticlesByKnowledgeBaseIdAndCategoryId([knowledge_base_id, category_id], result => {
                if(result.err){
                    result.err.errorIndex = 3821473;
                    return reject(result.err);
                }
    
                if(result.res.length == 0) return resolve([]);
    
                let articles_return = [];
                let articles = result.res;
                let numArticles = articles.length;
                let count = -1;
    
    
                articles.forEach(article => {
                    if(article.is_archived){
                        checkComplete();
                    }else{
                        pgQueries.getKnowledgeBaseArticleTranslationByArticleIdAndLocaleId(article.id, kb_locale_id, result1 => {
                            if(result1.err){
                                result1.err.errorIndex = 88892;
                                return reject(result1.err);
                            }
                
                            if(result1.res.length > 0){
                                let article_translation = result1.res[0];
                    
                                if(!article_translation.is_archived){
                                    article_translation.tooltip = consts.STATUS_COLOR_TEXT[article_translation.ui_color];
                                    article_translation.knowledge_base_id = article.knowledge_base_id;
                                    article_translation.category_id = article.category_id;
                    
                                    articles_return.push(article_translation);
                                }
                            }
                            
                            checkComplete();
                        });
                    }
                });
    
    
                checkComplete();
    
                function checkComplete(){
                    count++;
                    if(count == numArticles){
                        articles_return.sort(util.sortByUpdatedAt);
                        resolve(articles_return);
                    }
                }
            });
        }
    });
}

module.exports = async (args) => {
    return getData(args);
}
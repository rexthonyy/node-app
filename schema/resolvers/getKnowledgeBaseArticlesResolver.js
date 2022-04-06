const pgQueries = require('../../postgres/kb-queries');
const consts = require('../../consts');
const util = require('../../util');

const getData = ({ category_id, kb_locale_id }) => {
    return new Promise((resolve, reject) => {

        pgQueries.getKnowledgeBaseArticlesByKnowledgeBaseCategoryId(category_id, result => {
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
                    pgQueries.getKnowledgeBaseArticleTranslationByArticleIdAndLocaleId(article.id, kb_locale_id, result => {
                        if(result.err){
                            result.err.errorIndex = 88892;
                            return reject(result.err);
                        }
            
                        if(result.res.length > 0){
                            let article_translation = result.res[0];
                
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
    });
}

module.exports = async (parents, args) => {
    let result = await getData(args);
    return result;
}
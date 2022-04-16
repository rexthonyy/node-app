const pgQueries = require('../../postgres/kb-queries');
const util = require('../../util');
const consts = require('../../consts');
const getCategoriesAndSubCategories = require('../resolverUtils/getCategoriesAndSubCategories');
const getCategoriesAtLevel = require('../resolverUtils/getCategoriesAtLevel');
const getNumberOfSubcategoriesArticlesAndCurrentLevelForCategoryId = require('../resolverUtils/getNumberOfSubcategoriesArticlesAndCurrentLevelForCategoryId');

const getData = ({ article_id, kb_locale_id }) => {
    return new Promise((resolve, reject) => {

        pgQueries.getKnowledgeBaseArticlesById(article_id, result => {
            if(result.err){
                result.err.errorIndex = 38473;
                return reject(result.err);
            }
    
            if(result.res.length == 0) return reject({ status: 404, message: "Article not found" });
    
            let article = result.res[0];
    
            if(article.is_archived) return reject({ status: 401, message: "Article archived" });
    
            pgQueries.getKnowledgeBaseArticleTranslationByArticleIdAndLocaleId(article_id, kb_locale_id, result1 => {
                if(result1.err){
                    result1.err.errorIndex = 88892;
                    return reject(result1.err);
                }
    
                if(result1.res.length == 0) return reject({ status: 404, message: "Article translation not found" });
    
                let article_translation = result1.res[0];
    
                if(article_translation.is_archived) return reject({ status: 401, message: "Article translation archived" });
    
                article_translation.tooltip = consts.STATUS_COLOR_TEXT[article_translation.ui_color];
                article_translation.knowledge_base_id = article.knowledge_base_id;
                article_translation.category_id = article.category_id;
    
                resolve(article_translation);
            });
        });
    });
}

module.exports = async (args) => {
    return getData(args);
}
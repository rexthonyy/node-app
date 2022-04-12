const pgQueries = require('../../postgres/kb-queries');
const getCategoryLevel = require('./getCategoryLevel');
const getStatusOfSubCategories = require('./getStatusOfSubCategories');

let getNumberOfSubcategoriesArticlesAndCurrentLevelForCategoryId = (knowledge_base_id, category_id, cb) => {
    let current_level = 0;
    getCategoryLevel(category_id, current_level, final_level => {
        getStatusOfSubCategories(category_id, status => {
            pgQueries.getKnowledgeBaseCategoriesByKnowledgeBaseIdAndParentId(knowledge_base_id, category_id, result => {
                let numSubcategories = result.res.length;
                pgQueries.getKnowledgeBaseArticlesByKnowledgeBaseCategoryId(category_id, result => {
                    let numArticles = result.res.length;
                    cb({
                        level: final_level,
                        num_categories: numSubcategories,
                        num_articles: numArticles,
                        status
                    });
                });
            });
        });
    });
};

module.exports = getNumberOfSubcategoriesArticlesAndCurrentLevelForCategoryId;
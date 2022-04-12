const getCategoriesAndSubCategories = require('../resolverUtils/getCategoriesAndSubCategories');
const getNumberOfSubcategoriesArticlesAndCurrentLevelForCategoryId = require('../resolverUtils/getNumberOfSubcategoriesArticlesAndCurrentLevelForCategoryId');
const getMaxLevels = require('../resolverUtils/getMaxLevels');

const getData = ({ knowledge_base_id, category_id, kb_locale_id }) => {
    return new Promise((resolve, reject) => {

        getNumberOfSubcategoriesArticlesAndCurrentLevelForCategoryId(knowledge_base_id, category_id, result => {
            if (result.level == 0) {
                result.level++;
            }
    
            getCategoriesAndSubCategories(knowledge_base_id, kb_locale_id, -1, tree => {

                getMaxLevels(tree, 0, 1, max_level => {
                    //filter the result bashed on the level
    
                    getCategoriesAndSubCategories(knowledge_base_id, kb_locale_id, category_id, tree => {
                        getMaxLevels(tree, 0, 1, depth => {
                            //filter the result bashed on the level
                            resolve({
                                level: result.level,
                                depth: depth,
                                max_level: max_level
                            });
                        });
                    });
                });
            });
        });
    });
}

module.exports = async (parents, args) => {
    let result = await getData(args);
    return result;
}
const pgQueries = require('../../postgres/kb-queries');
const consts = require('../../consts');
const getData = ({category_id}) => {
    return new Promise((resolve, reject) => {
        
        archiveSubCategory(category_id, () => {
            resolve({ 
                status: "success", 
                message: "Successfully archived"
            });
        });
    });
}


function archiveSubCategory(category_id, cb){
    let values1 = [
        category_id,
        true
    ];

    let values2 = [
        category_id,
        true,
        consts.STATUS_COLOR.archived
    ];
    
    pgQueries.updateKnowledgeBaseCategoriesArchivedStatusByCategoryId(values1, result1 => {
        pgQueries.updateKnowledgeBaseCategoryTranslationsArchivedStatusByCategoryId(values2, result2 => {
            pgQueries.updateKnowledgeBaseArticlesArchivedStatusByCategoryId(values1, result3 => {
                pgQueries.updateKnowledgeBaseArticleTranslationsArchivedStatusByCategoryId(values2, result4 => {
                    //determine if there are sub categories to this category
                    pgQueries.getKnowledgeBaseCategoriesByParentId(category_id, result => {
                        if(result.res.length == 0) return cb();

                        let categories = result.res;
                        let numCategories = categories.length;
                        let count = -1;

                        categories.forEach(category => {
                            archiveSubCategory(category.id, () => {
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
}

module.exports = async (parents, args) => {
    return getData(args);
}
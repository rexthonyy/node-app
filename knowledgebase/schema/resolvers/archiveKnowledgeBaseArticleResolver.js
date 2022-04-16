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
    
   
    pgQueries.updateKnowledgeBaseArticlesArchivedStatusByCategoryId(values1, result => {
        pgQueries.updateKnowledgeBaseArticleTranslationsArchivedStatusByCategoryId(values2, result2 => {
            cb();
        });
    });
}

module.exports = async (parents, args) => {
    return await getData(args);
}
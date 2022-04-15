const pgQueries = require('../../postgres/kb-queries');

function getReturnStatus(status, message, data = null){
    return {
        status,
        message,
        data
    };
}

const getData = ({knowledge_base_category_translation_id, operation}) => {
    return new Promise((resolve, reject) => {
        
        if(!["publish","delete","update"].find(option => option == operation)) return resolve(getReturnStatus("error","Please use either 'update','delete', or 'publish' for the operation"));

        pgQueries.getKnowledgeBaseCategoryDelayedJob(knowledge_base_category_translation_id, operation, result => {
            if(result.err){
                return resolve(getReturnStatus("error","Internal server error"));
            }
    
            if(result.res.length == 0) return resolve(getReturnStatus("error", "Not found"));

            resolve(getReturnStatus("success", "Result", result.res[0]));
        });
    });
}

module.exports = async (parents, args) => {
    return await getData(args);
}
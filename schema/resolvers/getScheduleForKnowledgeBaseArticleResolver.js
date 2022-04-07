const pgQueries = require('../../postgres/kb-queries');

function getReturnStatus(status, message, data = null){
    return {
        status,
        message
    };
}

const getData = ({knowledge_base_article_translation_id, schedule_type}) => {
    return new Promise((resolve, reject) => {
        
        if(!["publish","delete","update"].find(option => option == schedule_type)) return resolve(getReturnStatus("error","Please use either 'update','delete', or 'publish' for the schedule_type"));

        pgQueries.getKnowledgeBaseArticleDelayedJob(knowledge_base_article_translation_id, schedule_type, result => {
            if(result.err){
                return reject(result.err);
            }
    
            resolve(result.res[0]);
        });
    });
}

module.exports = async (parents, args) => {
    let result = await getData(args);
    return result;
}
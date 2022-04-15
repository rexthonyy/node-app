const pgQueries = require('../../postgres/kb-queries');

const getData = ({ knowledge_base_id, list_type }) => {
    return new Promise((resolve, reject) => {

        let values = [
            knowledge_base_id,
            list_type
        ];
    
        pgQueries.getKnowledgeBaseLists(values, result => {
            if(result.err){
                result.err.errorIndex = 100;
                return reject(result.err);
            }
    
            resolve(result.res);
        });
    });
}

module.exports = async (parents, args) => {
    return await getData(args);
}
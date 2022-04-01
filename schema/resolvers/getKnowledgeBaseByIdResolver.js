const pgQueries = require('../../postgres/kb-queries');

const getData = ({knowledge_base_id}) => {
    return new Promise((resolve, reject) => {
        
        pgQueries.listKnowledgeBasesById([knowledge_base_id], result => {
            if(result.err){
                return resolve(result.err);
            }
            resolve(result.res[0]);
        });
    });
}

module.exports = async (parents, args) => {
    let result = await getData(args);
    return result;
}
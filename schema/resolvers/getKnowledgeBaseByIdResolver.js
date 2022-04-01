const pgQueries = require('../../postgres/kb-queries');

const getData = ({id}) => {
    return new Promise((resolve, reject) => {
        
        pgQueries.listKnowledgeBasesById([id], result => {
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
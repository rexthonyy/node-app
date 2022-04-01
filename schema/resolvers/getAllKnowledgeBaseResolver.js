const pgQueries = require('../../postgres/kb-queries');

const getData = () => {
    return new Promise((resolve, reject) => {
        
        pgQueries.listKnowledgeBases(result => {
            if(result.err){
                return resolve(result.err);
            }
            resolve(result.res);
        });
    });
}

module.exports = async () => {
    let result = await getData()
    return result;
}
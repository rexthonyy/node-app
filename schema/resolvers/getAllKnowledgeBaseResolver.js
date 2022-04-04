const pgQueries = require('../../postgres/kb-queries');
const consts = require('../../consts');

const getData = () => {
    return new Promise((resolve, reject) => {
        
        pgQueries.listKnowledgeBases(result => {
            if(result.err){
                return resolve(result.err);
            }
            let knowledgebases = result.res;
            knowledgebases.forEach(knowledgebase => {
                knowledgebase.tooltip = consts.STATUS_COLOR_TEXT[knowledgebase.ui_color];
            });
            resolve(knowledgebases);
        });
    });
}

module.exports = async () => {
    let result = await getData()
    return result;
}
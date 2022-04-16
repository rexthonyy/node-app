const pgQueries = require('../../postgres/kb-queries');
const consts = require('../../consts');

const getData = ({knowledge_base_id}) => {
    return new Promise((resolve, reject) => {
        
        pgQueries.listKnowledgeBasesById([knowledge_base_id], result => {
            if(result.err){
                return resolve(result.err);
            }
            let knowledgebase = result.res[0];
            knowledgebase.tooltip = consts.STATUS_COLOR_TEXT[knowledgebase.ui_color];
            resolve(knowledgebase);
        });
    });
}

module.exports = async (parents, args) => {
    return getData(args);
}
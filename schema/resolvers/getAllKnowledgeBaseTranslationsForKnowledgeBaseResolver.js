const pgQueries = require('../../postgres/kb-queries');
const util = require('../../util');

const getData = ({knowledge_base_id}) => {
    return new Promise((resolve, reject) => {
        
        pgQueries.getKnowledgeBaseTranslationsByKnowledgeBaseId(knowledge_base_id, result => {
            if(result.err){
                return resolve(result.err);
            }
            let kb_translations = result.res;
            kb_translations.sort(util.sortByPosition);
            kb_translations.sort((a, b) => {
                return a.active ? -1 : 1;
            });
            resolve(kb_translations);
        });
    });
}

module.exports = async (parents, args) => {
    let result = await getData(args)
    return result;
}
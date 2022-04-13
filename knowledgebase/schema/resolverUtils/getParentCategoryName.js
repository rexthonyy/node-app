const pgQueries = require('../../postgres/kb-queries');

module.exports = (parent_id, locale_id, cb) => {
    if(parent_id == -1 || parent_id == null) return cb("knowledgebase");
    pgQueries.getKnowledgeBaseCategoryTranslationsByCategoryIdAndLocaleId(parent_id, locale_id, result => {
        if(result.err){
            return cb("");
        }
        cb(result.res[0].name);
    });
};
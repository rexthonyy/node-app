const pgQueries = require('../../postgres/kb-queries');

let getLanguageTitleFromLocaleId = (locale_id, cb) => {
    pgQueries.getLocaleById(locale_id, result => {
        if(result.err){
            return cb("");
        }

        cb(result.res[0].name);
    });
}
module.exports = getLanguageTitleFromLocaleId;
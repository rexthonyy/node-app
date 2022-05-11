const pgQueries = require('../../postgres/kb-queries');

const getData = ({ knowledge_base_id }) => {
    return new Promise((resolve, reject) => {
        // get the knowledge base languages
        pgQueries.getKnowledgeBaseTranslationsByKnowledgeBaseId(knowledge_base_id, result => {
            if(result.err){
                result.err.errorIndex = -1;
                return reject(result.err);
            }

            let kb_translations = result.res;
            pgQueries.listLocales(result => {
                if(result.err){
                    result.err.errorIndex = 8;
                    return reject(result.err);
                }
                
                let locales = result.res;

                let to_return = [];

                locales.forEach(locale => {
                    if(locale.active){
                        let is_found = false;
                        kb_translations.forEach(translation => {
                            if(translation.kb_locale_id == locale.id){
                                is_found = true;
                            }
                        });
                        if(!is_found){
                            to_return.push({
                                id: locale.id,
                                locale: locale.locale,
                                name: locale.name
                            });
                        }
                    }
                });

                resolve(to_return);
            });
        });
    });
}

module.exports = async (parents, args) => {
    return getData(args);
}
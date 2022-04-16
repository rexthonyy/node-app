const pgQueries = require('../../postgres/kb-queries');

module.exports = (knowledge_base_id, cb) => {
    //check the colors of the sub categories
    //set the ui colors of all the translations
    pgQueries.getKnowledgeBaseTranslationsByKnowledgeBaseId(knowledge_base_id, result => {
        let kb_translations = result.res;

        let numTranslations = kb_translations.length;
        let count = -1;

        kb_translations.forEach(kb_translation => {
            let kb_translation_id = kb_translation.id;
            let kb_locale_id = kb_translation.kb_locale_id;
            
            pgQueries.getKnowledgeBaseCategoryTranslationByLocaleId(kb_locale_id, result1 => {

                let primary_color = consts.STATUS_COLOR.pending_action;

                let numRed = 0;
                let numOrange = 0;
                let numGreen = 0;
                let numBlue = 0;
                let numGray = 0;
                let numYellow = 0;
                let numWhite = 0;

                let translations = result1.res;
                let numTrans = translations.length;
                translations.forEach(category_translation => {
                    let ui_color = category_translation.ui_color;
                    // logic goes here
                    switch(ui_color){
                        case consts.STATUS_COLOR.pending_action:
                            numRed++;
                        break;

                        case consts.STATUS_COLOR.draft:
                            numOrange++;
                        break;

                        case consts.STATUS_COLOR.published:
                            numGreen++;
                        break;

                        case consts.STATUS_COLOR.publish_scheduled:
                            numBlue++;
                        break;

                        case consts.STATUS_COLOR.archived:
                            numGray++;
                        break;

                        case consts.STATUS_COLOR.archive_scheduled:
                            numYellow++;
                        break;

                        case consts.STATUS_COLOR.update_scheduled:
                            numWhite++;
                        break;
                    }
                });

                if(numOrange == numTrans){
                    primary_color = consts.STATUS_COLOR.draft;
                }

                if(numGreen == numTrans){
                    primary_color = consts.STATUS_COLOR.published;
                }

                if(numBlue == numTrans){
                    primary_color = consts.STATUS_COLOR.publish_scheduled;
                }

                if(numGray == numTrans){
                    primary_color = consts.STATUS_COLOR.archived;
                }

                if(numGreen > 0){
                    primary_color = consts.STATUS_COLOR.published;
                }

                if(numGray > 0){
                    primary_color = consts.STATUS_COLOR.archived;
                }

                if(numBlue > 0){
                    primary_color = consts.STATUS_COLOR.publish_scheduled;
                }

                if(numYellow > 0){
                    primary_color = consts.STATUS_COLOR.archive_scheduled;
                }

                if(numWhite > 0){
                    primary_color = consts.STATUS_COLOR.update_scheduled;
                }

                if(numOrange > 0){
                    primary_color = consts.STATUS_COLOR.draft;
                }

                if(numRed > 0){
                    primary_color = consts.STATUS_COLOR.pending_action;
                }

                let values = [
                    kb_translation_id,
                    primary_color
                ];

                pgQueries.updateKnowledgeBaseTranslationUiColor(values, result2 => {
                    checkComplete();
                });
            });
        });

        checkComplete();

        function checkComplete(){
            count++;
            if(numTranslations == count){
                cb();
            }
        }
    });
};
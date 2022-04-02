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
            
            pgQueries.getKnowledgeBaseCategoryTranslationByLocaleId(kb_locale_id, result => {

                let primary_color = "red";

                let numRed = 0;
                let numOrange = 0;
                let numGreen = 0;
                let numBlue = 0;
                let numGray = 0;
                let numYellow = 0;
                let numWhite = 0;

                let translations = result.res;
                let numTranslations = translations.length;
                translations.forEach(category_translation => {
                    let ui_color = category_translation.ui_color;
                    // logic goes here
                    switch(ui_color){
                        case "red":
                            numRed++;
                        break;

                        case "orange":
                            numOrange++;
                        break;

                        case "green":
                            numGreen++;
                        break;

                        case "blue":
                            numBlue++;
                        break;

                        case "gray":
                            numGray++;
                        break;

                        case "yellow":
                            numYellow++;
                        break;

                        case "white":
                            numWhite++;
                        break;
                    }
                });

                if(numRed == numTranslations){
                    primary_color = "red";
                }

                if(numOrange == numTranslations){
                    primary_color = "orange";
                }

                if(numGreen == numTranslations){
                    primary_color = "green";
                }

                if(numBlue == numTranslations){
                    primary_color = "blue";
                }

                if(numGray == numTranslations){
                    primary_color = "gray";
                }

                if(numGreen > 0){
                    primary_color = "green";
                }

                if(numGray > 0){
                    primary_color = "gray";
                }

                if(numBlue > 0){
                    primary_color = "blue";
                }

                if(numYellow > 0){
                    primary_color = "yellow";
                }

                if(numWhite > 0){
                    primary_color = "white";
                }

                if(numOrange > 0){
                    primary_color = "orange";
                }

                if(numRed > 0){
                    primary_color = "red";
                }

                let values = [
                    kb_translation_id,
                    primary_color
                ];

                pgQueries.updateKnowledgeBaseTranslationUiColor(values, result => {
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
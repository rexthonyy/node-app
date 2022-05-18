const pgQueries = require('../../postgres/kb-queries');
const consts = require('../../consts');

let getStatusOfSubCategories = (category_id, cb) => {
    let numCatRed = 0;
    let numCatOrange = 0;
    let numCatBlue = 0;
    let numCatGreen = 0;
    let numCatYellow = 0;
    let numCatGray = 0;
    let numCatWhite = 0;

    let numArtRed = 0;
    let numArtOrange = 0;
    let numArtBlue = 0;
    let numArtGreen = 0;
    let numArtYellow = 0;
    let numArtGray = 0;
    let numArtWhite = 0;
    
    pgQueries.getKnowledgeBaseCategoriesByParentId(category_id, result => {
        let categories = result.res;
        let num_categories = categories.length;
        let count = -1;
        let translations = [];

        categories.forEach(category => {
            pgQueries.getKnowledgeBaseCategoryTranslationsByCategoryId(null, category.id, (_null, result1) => {
                let category_translations = result1.res;
                if(category_translations != null)
                    category_translations.forEach(translation => {
                        translations.push(translation);
                    });
                checkComplete();
            });
        });

        checkComplete();

        function checkComplete(){
            count++;
            if(count == num_categories){
                if(translations.length == 0) return finished();

                let numTranslations = translations.length;
                count = -1;

                checkComplete1();

                translations.forEach(trans => {
                    switch(trans.ui_color){
                        case consts.STATUS_COLOR.pending_action:
                            numCatRed++;
                        break;

                        case consts.STATUS_COLOR.draft:
                            numCatOrange++;
                        break;

                        case consts.STATUS_COLOR.green:
                            numCatGreen++;
                        break;

                        case consts.STATUS_COLOR.archive_scheduled:
                            numCatYellow++;
                        break;

                        case consts.STATUS_COLOR.archived:
                            numCatGray++;
                        break;

                        case consts.STATUS_COLOR.update_scheduled:
                            numCatWhite++;
                        break;
                    }

                    let cat_id = trans.category_id;

                    pgQueries.getKnowledgeBaseArticleTranslationsByCategoryId(cat_id, result2 => {
                        let article_translations = result2.res;
                        if(article_translations){
                            article_translations.forEach(art_trans => {
                                switch(art_trans.ui_color){
                                    case consts.STATUS_COLOR.pending_action:
                                        numArtRed++;
                                    break;
                    
                                    case consts.STATUS_COLOR.draft:
                                        numArtOrange++;
                                    break;
                    
                                    case consts.STATUS_COLOR.green:
                                        numArtGreen++;
                                    break;
                    
                                    case consts.STATUS_COLOR.archive_scheduled:
                                        numArtYellow++;
                                    break;
                    
                                    case consts.STATUS_COLOR.archived:
                                        numArtGray++;
                                    break;

                                    case consts.STATUS_COLOR.update_scheduled:
                                        numArtWhite++;
                                    break;
                                }
                            });
                        }

                        checkComplete1();
                    });
                });

                function checkComplete1(){
                    count++;
                    if(count == numTranslations){
                        finished();
                    }
                }
            }
        }
    });
    
    function finished(){
        cb({
            categories: {
                no_action: {
                    color: consts.STATUS_COLOR.pending_action,
                    count: numCatRed
                },
                draft: {
                    color: consts.STATUS_COLOR.draft,
                    count: numCatOrange
                },
                scheduled_to_publish: {
                    color: consts.STATUS_COLOR.publish_scheduled,
                    count: numCatBlue
                },
                published: {
                    color: consts.STATUS_COLOR.published,
                    count: numCatGreen
                },
                scheduled_to_update: {
                    color: consts.STATUS_COLOR.update_scheduled,
                    count: numCatWhite
                },
                scheduled_to_archive: {
                    color: consts.STATUS_COLOR.archive_scheduled,
                    count: numCatYellow
                },
                archived: {
                    color: consts.STATUS_COLOR.archived,
                    count: numCatGray
                }
            },
            articles: {
                no_action: {
                    color: consts.STATUS_COLOR.pending_action,
                    count: numArtRed
                },
                draft: {
                    color: consts.STATUS_COLOR.draft,
                    count: numArtOrange
                },
                scheduled_to_publish: {
                    color: consts.STATUS_COLOR.publish_scheduled,
                    count: numArtBlue
                },
                published: {
                    color: consts.STATUS_COLOR.published,
                    count: numArtGreen
                },
                scheduled_to_update: {
                    color: consts.STATUS_COLOR.update_scheduled,
                    count: numArtWhite
                },
                scheduled_to_archive: {
                    color: consts.STATUS_COLOR.archive_scheduled,
                    count: numArtYellow
                },
                archived: {
                    color: consts.STATUS_COLOR.archived,
                    count: numArtGray
                }
            }
        });
    }
}

module.exports = getStatusOfSubCategories;
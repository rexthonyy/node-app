const pgQueries = require('../../postgres/kb-queries');
const consts = require('../../consts');
const getCategoriesAndSubCategories = require('../resolverUtils/getCategoriesAndSubCategories');
const getCategoriesAtLevel = require('../resolverUtils/getCategoriesAtLevel');

const getData = ({ knowledge_base_id, kb_locale_id, level }) => {
    return new Promise((resolve, reject) => {

        let numCategories = 0;
        let numArticles = 0;

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

        getCategoriesAndSubCategories(knowledge_base_id, kb_locale_id, -1, tree => {
            //filter the result bashed on the level
            let index = 1;
            getCategoriesAtLevel(tree, level, index, translations => {
                if(translations.length == 0) return finished();
            
                numCategories = translations.length;
                let count = -1;
            
                checkComplete1();
            
                translations.forEach(trans => {
                    switch(trans.ui_color){
                        case consts.STATUS_COLOR.pending_action:
                            numCatRed++;
                        break;
            
                        case consts.STATUS_COLOR.draft:
                            numCatOrange++;
                        break;
            
                        case consts.STATUS_COLOR.published:
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
            
                    let category_id = trans.category_id;
            
                    pgQueries.getKnowledgeBaseArticleTranslationsByCategoryId(category_id, result => {
                        let article_translations = result.res;
                        if(article_translations){
                            numArticles += article_translations.length;
                            article_translations.forEach(art_trans => {
                                switch(art_trans.ui_color){
                                    case consts.STATUS_COLOR.pending_action:
                                        numArtRed++;
                                    break;
                    
                                    case consts.STATUS_COLOR.draft:
                                        numArtOrange++;
                                    break;
                    
                                    case consts.STATUS_COLOR.published:
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
                    if(count == numCategories){
                        finished();
                    }
                }
            });
        });

        function finished(){
            
            resolve({
                categories: {
                    count: numCategories,
                    no_action: {
                        tooltip: consts.STATUS_COLOR_TEXT[consts.STATUS_COLOR.pending_action],
                        color: consts.STATUS_COLOR.pending_action,
                        count: numCatRed
                    },
                    draft: {
                        tooltip: consts.STATUS_COLOR_TEXT[consts.STATUS_COLOR.draft],
                        color: consts.STATUS_COLOR.draft,
                        count: numCatOrange
                    },
                    scheduled_to_publish: {
                        tooltip: consts.STATUS_COLOR_TEXT[consts.STATUS_COLOR.publish_scheduled],
                        color: consts.STATUS_COLOR.publish_scheduled,
                        count: numCatBlue
                    },
                    published: {
                        tooltip: consts.STATUS_COLOR_TEXT[consts.STATUS_COLOR.published],
                        color: consts.STATUS_COLOR.published,
                        count: numCatGreen
                    },
                    scheduled_to_update: {
                        tooltip: consts.STATUS_COLOR_TEXT[consts.STATUS_COLOR.update_scheduled],
                        color: consts.STATUS_COLOR.update_scheduled,
                        count: numCatWhite
                    },
                    scheduled_to_archive: {
                        tooltip: consts.STATUS_COLOR_TEXT[consts.STATUS_COLOR.archive_scheduled],
                        color: consts.STATUS_COLOR.archive_scheduled,
                        count: numCatYellow
                    },
                    archived: {
                        tooltip: consts.STATUS_COLOR_TEXT[consts.STATUS_COLOR.archived],
                        color: consts.STATUS_COLOR.archived,
                        count: numCatGray
                    }
                },
                articles: {
                    count: numArticles,
                    no_action: {
                        tooltip: consts.STATUS_COLOR_TEXT[consts.STATUS_COLOR.pending_action],
                        color: consts.STATUS_COLOR.pending_action,
                        count: numArtRed
                    },
                    draft: {
                        tooltip: consts.STATUS_COLOR_TEXT[consts.STATUS_COLOR.draft],
                        color: consts.STATUS_COLOR.draft,
                        count: numArtOrange
                    },
                    scheduled_to_publish: {
                        tooltip: consts.STATUS_COLOR_TEXT[consts.STATUS_COLOR.publish_scheduled],
                        color: consts.STATUS_COLOR.publish_scheduled,
                        count: numArtBlue
                    },
                    published: {
                        tooltip: consts.STATUS_COLOR_TEXT[consts.STATUS_COLOR.published],
                        color: consts.STATUS_COLOR.published,
                        count: numArtGreen
                    },
                    scheduled_to_update: {
                        tooltip: consts.STATUS_COLOR_TEXT[consts.STATUS_COLOR.update_scheduled],
                        color: consts.STATUS_COLOR.update_scheduled,
                        count: numArtWhite
                    },
                    scheduled_to_archive: {
                        tooltip: consts.STATUS_COLOR_TEXT[consts.STATUS_COLOR.archive_scheduled],
                        color: consts.STATUS_COLOR.archive_scheduled,
                        count: numArtYellow
                    },
                    archived: {
                        tooltip: consts.STATUS_COLOR_TEXT[consts.STATUS_COLOR.archived],
                        color: consts.STATUS_COLOR.archived,
                        count: numArtGray
                    }
                }
            });
        }
    });
}

module.exports = async (args) => {
    return getData(args);
}
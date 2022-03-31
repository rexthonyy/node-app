const express = require("express");
const router = express.Router();
const pgQueries = require('../postgres/kb-queries');
const util = require('../util');
const fs = require('fs');
var Multer = require("multer");

function recordHistory(activity_type, activity_name, metadata, cb){
    let values = [
        activity_type,
        activity_name,
        metadata
    ];

    pgQueries.createActivityStream(values, result => {
        cb();
    });
}

function updateUIColorForKnowledgeBase(knowledge_base_id, cb){
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
}

function updateUIColorForKnowledgeBaseCategoriesAndArticles(knowledge_base_id, category_id, cb){
    // get knowledge base category details
    pgQueries.getKnowledgeBaseCategoryTranslationsByKnowledgeBaseIdAndCategoryId([knowledge_base_id, category_id], result => {
        let category_translations = result.res;
        let num_category_translations = category_translations.length;
        let count = -1;

        category_translations.forEach(translation => {
            publish_now = translation.publish_now;
            active = translation.active;
            archived = translation.is_archived;
            is_delete_scheduled = translation.is_delete_scheduled;
            is_update_scheduled = translation.is_update_scheduled;

            let ui_color = "red";

            if(active){
                ui_color = "green";
            }else{
                ui_color = "orange";
                if(!publish_now){
                    ui_color = "blue";
                }
            }
            
            if(archived){
                ui_color = "gray";
            }else{
                if(is_delete_scheduled){
                    ui_color = "yellow";
                }else if(is_update_scheduled){
                    ui_color = "white";
                }
            }

            pgQueries.updateKnowledgeBaseCategoryTranslationsUIColor([translation.id, ui_color], result => {
                checkComplete();
            });
        });

        checkComplete();

        function checkComplete(){
            count++;
            if(count == num_category_translations){
                pgQueries.getKnowledgeBaseArticleTranslationsByKnowledgeBaseIdAndCategoryId([knowledge_base_id, category_id], result => {
                    let article_translations = result.res;
                    let num_article_translations = article_translations.length;
                    let count = -1;

                    article_translations.forEach(translation => {
                        publish_now = translation.publish_now;
                        active = translation.active;
                        archived = translation.is_archived;
                        is_delete_scheduled = translation.is_delete_scheduled;
                        is_update_scheduled = translation.is_update_scheduled;
            
                        let ui_color = "red";
            
                        if(active){
                            ui_color = "green";
                        }else{
                            ui_color = "orange";
                            if(!publish_now){
                                ui_color = "blue";
                            }
                        }
                        
                        if(archived){
                            ui_color = "gray";
                        }else{
                            if(is_delete_scheduled){
                                ui_color = "yellow";
                            }else if(is_update_scheduled){
                                ui_color = "white";
                            }
                        }
            
                        pgQueries.updateKnowledgeBaseArticleTranslationsUIColor([translation.id, ui_color], result => {
                            checkComplete1();
                        });
                    });

                    checkComplete1();

                    function checkComplete1(){
                        count++;
                        if(count == num_article_translations){
                            cb();
                        }
                    }
                });
            }
        }
    });

    pgQueries.getKnowledgeBaseCategoriesByKnowledgeBaseIdAndCategoryId([knowledge_base_id, category_id], result => {
        let kb_categories = result.res;
        let num_categories = kb_categories.length;
        let count = -1;

        kb_categories.forEach(category => {
        });

        checkComplete();

        function checkComplete(){
            count++;
            if(count == num_categories){
                // update article colors
            }
        }
    });
}

router.get("/getStatusColorForKnowledgeBaseTranslation/filter_by/:filter_by/knowledge_base_id/:knowledge_base_id/category_id/:category_id", (req, res) => {
    let knowledge_base_id = req.params.knowledge_base_id;
    let filter_by = req.params.filter_by;
    let category_id = req.params.category_id;

    if(!["article","category"].find(filterWith => filterWith == filter_by)) return res.status(405).json({status:"error", message: "Please enter either 'article' or 'category' for filter_by"});

    // get the category whose status we want to analyze
    pgQueries.getKnowledgeBaseCategoriesByKnowledgeBaseIdAndParentId(knowledge_base_id, category_id, result => {
        if(result.err){
            result.err.errorIndex = 100;
            return res.json(result.err);
        }

        if(result.res.length == 0) {
            return res.status(404).json({ status: "error", message: "Category not found" });
        }

        let categories = result.res;
        
        pgQueries.getKnowledgeBaseTranslationsByKnowledgeBaseId(knowledge_base_id, result => {
            if(result.err){
                result.err.errorIndex = 200;
                return res.json(result.err);
            }

            let kb_translations = result.res;
            let num_translations = kb_translations.length;
            let count = -1;

            let kb_status_color_translations = [];

            kb_translations.forEach(translation => {
                let num_categories = categories.length;
                let count1 = -1;

                let active_colors = [];

                categories.forEach(category => {
                    if(filter_by == "category"){
                        pgQueries.getKnowledgeBaseCategoryTranslationsByKnowledgeBaseIdCategoryIdAndLocaleId([knowledge_base_id, category.id, translation.kb_locale_id], result => {
                            if(result.res == null || result.res.length==0) return checkComplete1();
                            active_colors.push(result.res[0].ui_color);
                            checkComplete1();
                        });
                    }else{
                        pgQueries.getKnowledgeBaseArticleTranslationsByKnowledgeBaseIdCategoryIdAndLocaleId([knowledge_base_id, category.id, translation.kb_locale_id], result => {
                            if(result.res == null || result.res.length==0) return checkComplete1();
                            active_colors.push(result.res[0].ui_color);
                            checkComplete1();
                        });
                    }
                });

                checkComplete1();
                function checkComplete1(){
                    count1++;
                    if(count1 == num_categories){
                        //apply logic to get the main color for this translation
                        let primary_color = "red";

                        let numRed = 0;
                        let numOrange = 0;
                        let numGreen = 0;
                        let numBlue = 0;
                        let numGray = 0;
                        let numYellow = 0;
                        let numWhite = 0;

                        active_colors.forEach(ui_color => {
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

                        if(numRed == num_categories){
                            primary_color = "red";
                        }

                        if(numOrange == num_categories){
                            primary_color = "orange";
                        }

                        if(numGreen == num_categories){
                            primary_color = "green";
                        }

                        if(numBlue == num_categories){
                            primary_color = "blue";
                        }

                        if(numGray == num_categories){
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

                        kb_status_color_translations.push({
                            kb_locale_id: translation.kb_locale_id,
                            knowledge_base_translation_id: translation.id,
                            ui_color: primary_color,
                            title: translation.title,
                            default: translation.active
                        });

                        checkComplete();
                    }
                }
            });

            checkComplete();

            function checkComplete(){
                count++;
                if(count == num_translations){
                    return res.json(kb_status_color_translations);
                }
            }
        });
    });
});

router.get("/getKnowledgeBaseCategoriesByLevel/knowledge_base_id/:knowledge_base_id/kb_locale_id/:kb_locale_id/level/:level", (req, res) => {
    let knowledge_base_id = req.params.knowledge_base_id;
    let kb_locale_id = req.params.kb_locale_id;
    let level = req.params.level;

    if(level > 5 || level < 1) return res.status(401).json({ status: "error", message: "The level must be between 1 and 5"});

    getCategoriesAndSubCategories1(knowledge_base_id, kb_locale_id, -1, tree => {
        getMaxLevels(tree, 0, 1, max_level => {
            //filter the result bashed on the level
            let index = 1;
            getCategoriesAtLevel(tree, level, index, level_categories => {
                let result = util.paginate(req, level_categories);
                result.max_level = max_level;
                res.json(result);
            });
        });
    });
});

function getCategoriesAtLevel(tree, level, index, cb){
    if(level == index){
        tree.forEach(translation => {
            delete translation.subcategories;
        });
        return cb(tree);
    }

    if(tree.length == 0) return cb(null);

    let next_index = index + 1;

    let level_cat = [];

    tree.forEach(translation => {
        getCategoriesAtLevel(translation.subcategories, level, next_index, level_categories => {
            if(index == 1){
                if(level_categories != null){
                    level_cat = level_cat.concat(level_categories);
                }
                cb(level_cat);
            }else{
                cb(level_categories);
            }
        });
    });
}

function getMaxLevels(tree, level, index, cb){
    let num_subcategories = tree.length;
    let count = -1;
    let all_levels = [];

    if(num_subcategories == 0) return cb(index);

    let next_level = level + 1;

    if(next_level > index){
        index = next_level;
    }

    tree.forEach(translation => {
        getMaxLevels(translation.subcategories, next_level, index, max_level => {
            checkComplete(max_level);
        });
    });

    checkComplete(0);

    function checkComplete(a){
        all_levels.push(a);
        count++;
        if(count == num_subcategories){
            cb(Math.max.apply(Math, all_levels));
        }
    }
}

function getCategoriesAndSubCategories1(knowledge_base_id, kb_locale_id, parent_id, cb){
    pgQueries.getKnowledgeBaseCategoriesByKnowledgeBaseIdAndParentId(knowledge_base_id, parent_id, result => {
        if(result.err){
            return cb([]);
        }
    
        let kb_category_translations = [];
    
        let kbCategories = result.res;
        let numCategories = kbCategories.length;
        let count = -1;
    
        kbCategories.forEach(kbCategory => {
            pgQueries.getKnowledgeBaseCategoryTranslationsByCategoryIdAndLocaleId(kbCategory.id, kb_locale_id, result2 => {
                if(result2.err){
                    return checkComplete();
                }
    
                if(result2.res.length == 0){
                    checkComplete();
                }else{
                    let kbCategoryTranslation = result2.res[0];

                    kbCategoryTranslation.position = kbCategory.position;
                    kbCategoryTranslation.parent_id = parent_id;
                    kbCategoryTranslation.schedule_at = null;

                    getNumberOfSubcategoriesArticlesAndCurrentLevelForCategoryId(knowledge_base_id, kbCategory.id, result => {
                        kbCategoryTranslation.stat = {
                            level: result.level,
                            num_categories: result.num_categories,
                            num_articles: result.num_articles
                        };

                        if(kbCategoryTranslation.publish_now){
                            kb_category_translations.push(kbCategoryTranslation);
                            checkComplete();
                        }else{
                            pgQueries.getKnowledgeBaseCategoryDelayedJobByKnowledgeBaseCategoryTranslationId(kbCategoryTranslation.id, result1 => {
                                if(result1.err){
                                    return checkComplete();
                                }
                
                                kbCategoryTranslation.schedule_at = null;
                                if(result1.res.length > 0){
                                    kbCategoryTranslation.schedule_at = result1.res[0].run_at;
                                }
                                kb_category_translations.push(kbCategoryTranslation);
        
        
                                checkComplete();
                            });
                        }
                    });
        
                }
            });
        });
    
        checkComplete();
    
        function checkComplete(){
            count++;
            if(count == numCategories){
                kb_category_translations.sort(util.sortByPosition);
                let numCategoryTrans = kb_category_translations.length;
                count = -1;
                kb_category_translations.forEach(kbCategoryTrans => {
                    let category_id = kbCategoryTrans.category_id;
                    getCategoriesAndSubCategories1(knowledge_base_id, kb_locale_id, category_id, categories => {
                        kbCategoryTrans.subcategories = [];
                        if(categories.length > 0){
                            kbCategoryTrans.subcategories = categories;
                        }
                        checkComplete2();
                    });
                });

                checkComplete2();

                function checkComplete2(){
                    count++;
                    if(count == numCategoryTrans){
                        cb(kb_category_translations);
                    }
                }
            }
        }
    });
}
/*
[
    {
        knowledge_base_translation_id: 1,
        ui_color: red,
        title: "English",
        default: true
    }
]
*/

router.get("/getKnowledgeBaseArticlesByLevel/knowledge_base_id/:knowledge_base_id/kb_locale_id/:kb_locale_id/level/:level", (req, res) => {
    let knowledge_base_id = req.params.knowledge_base_id;
    let kb_locale_id = req.params.kb_locale_id;
    let level = req.params.level;

    if(level > 5 || level < 1) return res.status(401).json({ status: "error", message: "The level must be between 1 and 5"});

    getCategoriesAndSubCategories1(knowledge_base_id, kb_locale_id, -1, tree => {
        //get the max number of levels
        getMaxLevels(tree, 0, 1, max_level => {
            //filter the result bashed on the level
            let index = 1;
            getCategoriesAtLevel(tree, level, index, level_categories => {
                // get the articles from this list
                let num_level_categories = level_categories.length;
                let count = -1;
    
                let articles = [];
    
                level_categories.forEach(category => {
                    pgQueries.getKnowledgeBaseArticleTranslationsByKnowledgeBaseIdCategoryIdAndLocaleId([knowledge_base_id, category.category_id, kb_locale_id], result => {
    
                        if(result.res == null || result.res.length == 0){
                            checkComplete();
                        }else{
                            articles = articles.concat(result.res);
                            checkComplete();
                        }
                    });
                });
    
                checkComplete();
    
                function checkComplete(){
                    count++;
                    if(count == num_level_categories){
                        let result = util.paginate(req, articles);
                        result.max_level = max_level;
                        res.json(result);
                    }
                }
            });
        });
    });
});

router.get("/getStatus/category_id/:category_id", (req, res) => {
    let category_id = req.params.category_id;

    getStatusOfSubCategories(category_id, status => {
        res.json(status);
    });
});

router.get("/getListStatus/knowledge_base_id/:knowledge_base_id/parent_id/:parent_id/kb_locale_id/:kb_locale_id/list_name/:list_name", (req, res) => {
    let knowledge_base_id = req.params.knowledge_base_id;
    let kb_locale_id = req.params.kb_locale_id;
    let parent_id = req.params.parent_id;
    let list_name = req.params.list_name;

    let numCatRed = numCatOrange = numCatBlue = numCatGreen = numCatYellow = numCatGray = numCatWhite = 0;
    let numArtRed = numArtOrange = numArtBlue = numArtGreen = numArtYellow = numArtGray = numArtWhite = 0;

    getCategoriesAndSubCategoriesForGroup2(req, res, knowledge_base_id, kb_locale_id, parent_id, null, list_name, translations => {
        if(translations.length == 0) return finished();

        let numTranslations = translations.length;
        count = -1;

        checkComplete1();

        translations.forEach(trans => {
            switch(trans.ui_color){
                case "red":
                    numCatRed++;
                break;

                case "orange":
                    numCatOrange++;
                break;

                case "green":
                    numCatGreen++;
                break;

                case "yellow":
                    numCatYellow++;
                break;

                case "gray":
                    numCatGray++;
                break;

                case "white":
                    numCatWhite++;
                break;
            }

            let category_id = trans.category_id;

            pgQueries.getKnowledgeBaseArticleTranslationsByCategoryId(category_id, result => {
                let article_translations = result.res;
                if(article_translations){
                    article_translations.forEach(art_trans => {
                        switch(art_trans.ui_color){
                            case "red":
                                numArtRed++;
                            break;
            
                            case "orange":
                                numArtOrange++;
                            break;
            
                            case "green":
                                numArtGreen++;
                            break;
            
                            case "yellow":
                                numArtYellow++;
                            break;
            
                            case "gray":
                                numArtGray++;
                            break;

                            case "white":
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
    });

    function finished(){
        res.json({
            categories: {
                no_action: {
                    color: "red",
                    count: numCatRed
                },
                draft: {
                    color: "orange",
                    count: numCatOrange
                },
                scheduled_to_publish: {
                    color: "blue",
                    count: numCatBlue
                },
                published: {
                    color: "green",
                    count: numCatGreen
                },
                scheduled_to_update: {
                    color: "white",
                    count: numCatWhite
                },
                scheduled_to_archive: {
                    color: "yellow",
                    count: numCatYellow
                },
                archived: {
                    color: "gray",
                    count: numCatGray
                }
            },
            articles: {
                no_action: {
                    color: "red",
                    count: numArtRed
                },
                draft: {
                    color: "orange",
                    count: numArtOrange
                },
                scheduled_to_publish: {
                    color: "blue",
                    count: numArtBlue
                },
                published: {
                    color: "green",
                    count: numArtGreen
                },
                scheduled_to_update: {
                    color: "white",
                    count: numArtWhite
                },
                scheduled_to_archive: {
                    color: "yellow",
                    count: numArtYellow
                },
                archived: {
                    color: "gray",
                    count: numArtGray
                }
            }
        });
    }
});

function getNumberOfSubcategoriesArticlesAndCurrentLevelForCategoryId(knowledge_base_id, category_id, cb){
    let current_level = 0;
    getCategoryLevel(category_id, current_level, final_level => {
        getStatusOfSubCategories(category_id, status => {
            pgQueries.getKnowledgeBaseCategoriesByKnowledgeBaseIdAndParentId(knowledge_base_id, category_id, result => {
                let numSubcategories = result.res.length;
                pgQueries.getKnowledgeBaseArticlesByKnowledgeBaseCategoryId(category_id, result => {
                    let numArticles = result.res.length;
                    cb({
                        level: final_level,
                        num_categories: numSubcategories,
                        num_articles: numArticles,
                        status
                    });
                });
            });
        });
    });
}

function getStatusOfSubCategories(category_id, cb){
    let numCatRed = numCatOrange = numCatBlue = numCatGreen = numCatYellow = numCatGray = numCatWhite = 0;
    let numArtRed = numArtOrange = numArtBlue = numArtGreen = numArtYellow = numArtGray = numArtWhite = 0;
    
    pgQueries.getKnowledgeBaseCategoriesByParentId(category_id, result => {
        let categories = result.res;
        let num_categories = categories.length;
        let count = -1;
        let translations = [];

        categories.forEach(category => {
            pgQueries.getKnowledgeBaseCategoryTranslationsByCategoryId(null, category.id, (_null, result) => {
                let category_translations = result.res;

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
                        case "red":
                            numCatRed++;
                        break;

                        case "orange":
                            numCatOrange++;
                        break;

                        case "green":
                            numCatGreen++;
                        break;

                        case "yellow":
                            numCatYellow++;
                        break;

                        case "gray":
                            numCatGray++;
                        break;

                        case "white":
                            numCatWhite++;
                        break;
                    }

                    let category_id = trans.category_id;

                    pgQueries.getKnowledgeBaseArticleTranslationsByCategoryId(category_id, result => {
                        let article_translations = result.res;
                        if(article_translations){
                            article_translations.forEach(art_trans => {
                                switch(art_trans.ui_color){
                                    case "red":
                                        numArtRed++;
                                    break;
                    
                                    case "orange":
                                        numArtOrange++;
                                    break;
                    
                                    case "green":
                                        numArtGreen++;
                                    break;
                    
                                    case "yellow":
                                        numArtYellow++;
                                    break;
                    
                                    case "gray":
                                        numArtGray++;
                                    break;

                                    case "white":
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
                    color: "red",
                    count: numCatRed
                },
                draft: {
                    color: "orange",
                    count: numCatOrange
                },
                scheduled_to_publish: {
                    color: "blue",
                    count: numCatBlue
                },
                published: {
                    color: "green",
                    count: numCatGreen
                },
                scheduled_to_update: {
                    color: "white",
                    count: numCatWhite
                },
                scheduled_to_archive: {
                    color: "yellow",
                    count: numCatYellow
                },
                archived: {
                    color: "gray",
                    count: numCatGray
                }
            },
            articles: {
                no_action: {
                    color: "red",
                    count: numArtRed
                },
                draft: {
                    color: "orange",
                    count: numArtOrange
                },
                scheduled_to_publish: {
                    color: "blue",
                    count: numArtBlue
                },
                published: {
                    color: "green",
                    count: numArtGreen
                },
                scheduled_to_update: {
                    color: "white",
                    count: numArtWhite
                },
                scheduled_to_archive: {
                    color: "yellow",
                    count: numArtYellow
                },
                archived: {
                    color: "gray",
                    count: numArtGray
                }
            }
        });
    }
}

function getCategoryLevel(category_id, level, cb){
    pgQueries.listKnowledgeBaseCategoriesById(category_id, result => {
        if(result.res.length == 0) return cb(level);

        level++;
        let category = result.res[0];
        getCategoryLevel(category.parent_id, level, final_level => {
            cb(final_level);
        });
    });
}

function returnResult(res, result){
    if(result.err){
        return res.json(result.err);
    }
    res.json(result.res);
}

router.get("/import1", (req, res) => {
    let knowledge_base_id = 39;
    let parent_id = -1;
    let kb_locale_id = 1;
    let ui_color = "red";

    let importData = 
    ``;

    let tableData = [];

    let rows = importData.trim().split("\n");


    rows.forEach(row => {
        let columns = row.trim().split(",");

        tableData.push(columns);
    });

    let numTableRows = tableData.length;
    let count = -1;

    tableData.forEach(row => {
        let position = Number(row[0]);
        let created_at = new Date().toUTCString();//row[11];
        let updated_at = new Date().toUTCString();//row[12];

        let values = [
            knowledge_base_id,
            parent_id,
            position,
            created_at,
            updated_at
        ];

        pgQueries.createKnowledgeBaseCategory(values, result => {
            if(result.err){
                result.err.errorIndex = 37274638;
                return res.json(result.err);
            }
            let kb_category = result.res;
            let category_id = kb_category.id;

            let trans_values = [
                row[1],
                kb_locale_id,
                category_id,
                created_at,
                updated_at,
                ui_color,
                row[2],
                row[4],
                "",
                row[3],
                row[5],
                true,
                Boolean(row[8]),
                ""
            ];

            pgQueries.createKnowledgeBaseCategoryTranslation(trans_values, result1 => {
                if(result1.err){
                    result1.err.errorIndex = 3022342;
                    return res.json(result1.err);
                }

                checkComplete();
            });
        });
    });

    checkComplete();

    function checkComplete(){
        count++;
        if(count == numTableRows){
            res.json({ status: "success", message: "upload successful" });
        }
    }
});

router.post("/import",  Multer({storage: Multer.memoryStorage()}).single("import"), (req, res) => {
    const text = Buffer.from(req.file.buffer).toString("utf-8");

    const text2 = 
    `
    [knowledge_bases]
    id,name,icon,footer,created_at,homepage_layout,category_layout,active,updated_at,front_page
    39,Professions,,,Fri Mar 04 2022 11:43:33 GMT+0000 (Coordinated Universal Time),No,,true,Mon Mar 07 2022 12:22:02 GMT+0000 (Coordinated Universal Time),false

    [knowledge_base_translations]
    id,knowledge_base_id,title,created_at,updated_at,footer_note,kb_locale_id,active
    239,39,English (United States),Mon Mar 07 2022 12:22:02 GMT+0000 (Coordinated Universal Time),Mon Mar 07 2022 12:22:02 GMT+0000 (Coordinated Universal Time),,1,true

    [knowledge_base_categories]
    id,knowledge_base_id,parent_id,position,created_at,updated_at
    48,39,-1,7,Wed Feb 02 2022 22:07:34 GMT+0000 (Coordinated Universal Time),Tue Feb 08 2022 11:59:57 GMT+0000 (Coordinated Universal Time)
    49,39,-1,12,Wed Feb 02 2022 22:13:40 GMT+0000 (Coordinated Universal Time),Tue Feb 08 2022 12:00:02 GMT+0000 (Coordinated Universal Time)
    50,39,-1,14,Wed Feb 02 2022 22:21:39 GMT+0000 (Coordinated Universal Time),Tue Feb 08 2022 12:00:07 GMT+0000 (Coordinated Universal Time)
    51,39,-1,15,Wed Feb 02 2022 22:21:53 GMT+0000 (Coordinated Universal Time),Tue Feb 08 2022 12:00:09 GMT+0000 (Coordinated Universal Time)

    [knowledge_base_category_translations]
    id,name,kb_locale_id,category_id,created_at,updated_at,ui_color,category_icon,title_tag,footer,keywords,meta_description,publish_now,active,permission
    45,Decorator,1,210,Fri Mar 04 2022 12:18:08 GMT+0000 (Coordinated Universal Time),Fri Mar 04 2022 12:18:08 GMT+0000 (Coordinated Universal Time),red,https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/online-marketing.74e221b.svg,,,,,true,true,
    47,Plumber ,1,212,Fri Mar 04 2022 12:18:08 GMT+0000 (Coordinated Universal Time),Fri Mar 04 2022 12:18:08 GMT+0000 (Coordinated Universal Time),red,https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/graphics-design.d32a2f8.svg,,,,,true,true,
    48,Electrician ,1,213,Fri Mar 04 2022 12:18:08 GMT+0000 (Coordinated Universal Time),Fri Mar 04 2022 12:18:08 GMT+0000 (Coordinated Universal Time),red,https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/online-marketing.74e221b.svg,,,-1,,true,true,
    50,Roofer,1,215,Fri Mar 04 2022 12:18:08 GMT+0000 (Coordinated Universal Time),Fri Mar 04 2022 12:18:08 GMT+0000 (Coordinated Universal Time),red,https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/music-audio.320af20.svg,,,-1,,true,true,
    49,Carpenter ,1,214,Fri Mar 04 2022 12:18:08 GMT+0000 (Coordinated Universal Time),Fri Mar 04 2022 12:18:08 GMT+0000 (Coordinated Universal Time),red,https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/writing-translation.32ebe2e.svg,,,-1,,true,true,
    53,Mechanic ,1,218,Fri Mar 04 2022 12:18:08 GMT+0000 (Coordinated Universal Time),Fri Mar 04 2022 12:18:08 GMT+0000 (Coordinated Universal Time),red,https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/business.bbdf319.svg,,,-1,,true,true,
    51,Law Practitioner ,1,216,Fri Mar 04 2022 12:18:08 GMT+0000 (Coordinated Universal Time),Fri Mar 04 2022 12:18:08 GMT+0000 (Coordinated Universal Time),red,,,,-1,,true,true,

    [knowledge_base_category_delayed_jobs]
    id,knowledge_base_category_translation_id,run_at,created_at,knowledge_base_id

    [knowledge_base_articles]
    id,category_id,position,created_at,updated_at,knowledge_base_id

    [knowledge_base_article_translations]
    id,title,kb_locale_id,created_at,updated_at,body,keywords,title_tag,meta_description,article_id,active
    `;

    let rows = text.trim().split("\n");
    
    let knowledge_bases_rows = [];
    let knowledge_base_translations_rows = [];
    let knowledge_base_categories_rows = [];
    let knowledge_base_category_translations_rows = [];
    let knowledge_base_category_delayed_jobs_rows = [];
    let knowledge_base_articles_rows = [];
    let knowledge_base_article_translations_rows = [];

    let flag = -1;
    let index = 0;

    rows.forEach(row => {
        row = row.trim();
        if(row.length == 0 ){
            flag = -1;
            index = 0;
        }else{
            if(row.charAt(0) == "["){
                switch(row.trim()){
                    case "[knowledge_bases]":
                        flag = 1;
                    break;

                    case "[knowledge_base_translations]":
                        flag = 2;
                    break;

                    case "[knowledge_base_categories]":
                        flag = 3;
                    break;

                    case "[knowledge_base_category_translations]":
                        flag = 4;
                    break;

                    case "[knowledge_base_category_delayed_jobs]":
                        flag = 5;
                    break;

                    case "[knowledge_base_articles]":
                        flag = 6;
                    break;

                    case "[knowledge_base_article_translations]":
                        flag = 7;
                    break;

                    default:
                        flag = -1;
                    break;
                }
            }else{
                index++;
                if(index > 1){
                    let columns = row.split(",");
                    switch(flag){
                        case 1:
                            knowledge_bases_rows.push(columns);
                        break;

                        case 2:
                            knowledge_base_translations_rows.push(columns);
                        break;

                        case 3:
                            knowledge_base_categories_rows.push(columns);
                        break;

                        case 4:
                            knowledge_base_category_translations_rows.push(columns);
                        break;

                        case 5:
                            knowledge_base_category_delayed_jobs_rows.push(columns);
                        break;

                        case 6:
                            knowledge_base_articles_rows.push(columns);
                        break;

                        case 7:
                            knowledge_base_article_translations_rows.push(columns);
                        break;
                    }
                }
            }
        }
    });
/*
    return res.json({
        knowledge_bases_rows,
        knowledge_base_translations_rows,
        knowledge_base_categories_rows,
        knowledge_base_category_translations_rows,
        knowledge_base_category_delayed_jobs_rows,
        knowledge_base_articles_rows,
        knowledge_base_article_translations_rows
    });
*/
    // add documents into the database
    let knowledge_base_id_map = {};
    let knowledge_base_translation_id_map = {};
    let knowledge_base_categories_id_map = {};
    let knowledge_base_category_translations_id_map = {};
    let knowledge_base_category_delayed_jobs_id_map = {};
    let knowledge_base_articles_id_map = {};
    let knowledge_base_article_translations_id_map = {};

    // insert knowledge base data
    importKnowledgeBaseData(res, knowledge_base_id_map, knowledge_bases_rows, () => {
        importKnowledgeBaseTranslations(res, knowledge_base_id_map, knowledge_base_translation_id_map, knowledge_base_translations_rows, () => {
            importKnowledgeBaseCategories(res, knowledge_base_id_map, knowledge_base_categories_id_map, knowledge_base_categories_rows, () => {
                importKnowledgeBaseCategoryTranslations(res, knowledge_base_categories_id_map, knowledge_base_category_translations_id_map, knowledge_base_category_translations_rows, () => {
                    importKnowledgeBaseCategoryDelayedJobs(res, knowledge_base_id_map, knowledge_base_category_translations_id_map, knowledge_base_category_delayed_jobs_id_map, knowledge_base_category_delayed_jobs_rows, () => {
                        importKnowledgeBaseArticles(res, knowledge_base_id_map, knowledge_base_categories_id_map, knowledge_base_articles_id_map, knowledge_base_articles_rows, () => {
                            importKnowledgeBaseArticlesTranslations(res, knowledge_base_articles_id_map, knowledge_base_article_translations_id_map, knowledge_base_article_translations_rows, () => {
                                res.json({ status: "success", message: "Import successful!" });
                            });
                        });
                    });
                });
            });
        });
    });
});

function importKnowledgeBaseData(res, kb_id_map, kb_rows, cb){
    let numRows = kb_rows.length;
    let count = -1;

    kb_rows.forEach(row => {
        let data = {
            name: row[1],
            icon: row[2],
            footer: row[3],
            homepage_layout: row[5],
            category_layout: row[6],
            active: row[7] == "true",
            front_page: row[9]
        };

        pgQueries.createKnowledgeBase(data, result => {
            if(result.err){
                result.err.errorIndex = 84723929281;
                return res.status(500).json(result.err);
            }

            kb_id_map[row[0]] = result.res.id;
            checkComplete();
        });
    });

    checkComplete();

    function checkComplete(){
        count++;
        if(count == numRows){
            cb();
        }
    }
}

function importKnowledgeBaseTranslations(res, kb_id_map, kb_trans_id_map, kb_trans_rows, cb){
    let numRows = kb_trans_rows.length;
    let count = -1;

    kb_trans_rows.forEach(row => {
        let data = {
            title: row[2],
            footer_note: row[5],
            kb_locale_id: Number(row[6]),
            knowledge_base_id: kb_id_map[row[1]],
            active: row[7] == "true"
        };

        pgQueries.createKnowledgeBaseTranslation(data, result => {
            if(result.err){
                result.err.errorIndex = 8472343929281;
                return res.status(500).json(result.err);
            }

            kb_trans_id_map[row[0]] = result.res.id;
            checkComplete();
        });
    });

    checkComplete();

    function checkComplete(){
        count++;
        if(count == numRows){
            cb();
        }
    }
}

function importKnowledgeBaseCategories(res, kb_id_map, kb_cat_id_map, kb_cat_rows, cb){
    let numRows = kb_cat_rows.length;
    let count = -1;

    kb_cat_rows.forEach(row => {
        let values = [
            kb_id_map[row[1]],
            Number(row[2]),
            Number(row[3]),
            new Date(Date.parse(row[4])).toUTCString(),
            new Date(Date.parse(row[5])).toUTCString()
        ];

        pgQueries.createKnowledgeBaseCategory(values, result => {
            if(result.err){
                result.err.errorIndex = 1119281;
                return res.json(result.err);
            }
            
            kb_cat_id_map[row[0]] = result.res.id;
            checkComplete();
        });
    });

    checkComplete();

    function checkComplete(){
        count++;
        if(count == numRows){
            let numCategories = Object.entries(kb_cat_id_map).length;
            let countCat = -1;

            for(const [old_id, new_id] of Object.entries(kb_cat_id_map)){
                let category_id = new_id;
                pgQueries.listKnowledgeBaseCategoriesById(category_id, result => {
                    if(result.err){
                        result.err.errorIndex = 1009281;
                        return res.json(result.err);
                    }

                    let parent_id = kb_cat_id_map[result.res[0].parent_id+""];

                    if(parent_id){
                        pgQueries.updateKnowledgeBaseCategoryParentIdById(category_id, parent_id, result => {
                            if(result.err){
                                result.err.errorIndex = 9009281;
                                return res.json(result.err);
                            }

                            checkCompleteCat();
                        });
                    }else{
                        checkCompleteCat();
                    }
                });
            }
            checkCompleteCat();

            function checkCompleteCat(){
                countCat++;
                if(countCat == numCategories){
                    cb();
                }
            }
        }
    }
}

function importKnowledgeBaseCategoryTranslations(res, kb_cat_id_map, kb_cat_trans_id_map, kb_cat_trans_rows, cb){
    let numRows = kb_cat_trans_rows.length;
    let count = -1;

    kb_cat_trans_rows.forEach(row => {
        let values = [
            row[1],
            Number(row[2]),
            kb_cat_id_map[row[3]],
            new Date(Date.parse(row[4])).toUTCString(),
            new Date(Date.parse(row[5])).toUTCString(),
            row[6],
            row[7],
            row[8],
            row[9],
            row[10],
            row[11],
            row[12] == "true",
            row[13] == "true",
            row[14]
        ];

        pgQueries.createKnowledgeBaseCategoryTranslation(values, result => {
            if(result.err){
                result.err.errorIndex = 847236541;
                return res.status(500).json(result.err);
            }

            kb_cat_trans_id_map[row[0]] = result.res.id;
            checkComplete();
        });
    });

    checkComplete();

    function checkComplete(){
        count++;
        if(count == numRows){
            cb();
        }
    }
}

function importKnowledgeBaseCategoryDelayedJobs(res, kb_id_map, kb_cat_trans_id_map, kb_cat_delayed_job_id_map, kb_cat_delayed_job_rows, cb){
    let numRows = kb_cat_delayed_job_rows.length;
    let count = -1;

    kb_cat_delayed_job_rows.forEach(row => {
        let values = [
            kb_cat_trans_id_map[row[1]],
            row[2],
            kb_id_map[row[4]]
        ];

        pgQueries.createKnowledgeBaseCategoryDelayedJob(values, result => {
            if(result.err){
                result.err.errorIndex = 847236541;
                return res.status(500).json(result.err);
            }

            kb_cat_delayed_job_id_map[row[0]] = result.res.id;
            checkComplete();
        });
    });

    checkComplete();

    function checkComplete(){
        count++;
        if(count == numRows){
            cb();
        }
    }
}

function importKnowledgeBaseArticles(res, kb_id_map, kb_cat_id_map, kb_cat_art_id_map, kb_art_rows, cb){
    let numRows = kb_art_rows.length;
    let count = -1;

    kb_art_rows.forEach(row => {
        let data = {
            category_id: kb_cat_id_map[row[1]],
            position: Number(row[2]),
            created_at: new Date(Date.parse(row[3])).toUTCString(),
            updated_at: new Date(Date.parse(row[4])).toUTCString(),
            knowledge_base_id: kb_id_map[row[5]]
        };

        pgQueries.createKnowledgeBaseArticle(data, result => {
            if(result.err){
                result.err.errorIndex = 840036541;
                return res.status(500).json(result.err);
            }

            kb_cat_art_id_map[row[0]] = result.res.id;
            checkComplete();
        });
    });

    checkComplete();

    function checkComplete(){
        count++;
        if(count == numRows){
            cb();
        }
    }
}

function importKnowledgeBaseArticlesTranslations(res, kb_cat_art_id_map, kb_cat_art_trans_id_map, kb_art_trans_rows, cb){
    let numRows = kb_art_trans_rows.length;
    let count = -1;

    kb_art_trans_rows.forEach(row => {
        let data = {
            title: row[1],
            kb_locale_id: Number(row[2]),
            created_at: new Date(Date.parse(row[3])).toUTCString(),
            updated_at: new Date(Date.parse(row[4])).toUTCString(),
            body: row[5],
            keywords: row[6],
            title_tag: row[7],
            meta_description: row[8],
            article_id: kb_cat_art_id_map[row[9]],
            active: row[10] == "true"
        };

        pgQueries.createKnowledgeBaseArticleTranslation(data, result => {
            if(result.err){
                result.err.errorIndex = 840036541;
                return res.status(500).json(result.err);
            }

            kb_cat_art_trans_id_map[row[0]] = result.res.id;
            checkComplete();
        });
    });

    checkComplete();

    function checkComplete(){
        count++;
        if(count == numRows){
            cb();
        }
    }
}

router.get("/export", (req, res) => {
    let kb_id = req.query.knowledge_base_id;

    if(kb_id == null) return res.json({ status: "error", message: "Please enter the knowledge_base_id"});

    let data = "";

    //get the knowledge_bases
    exportKnowledgeBaseData(res, data, kb_id, result => {
        exportKnowledgeBaseTranslations(res, result, kb_id, result => {
            exportKnowledgeBaseCategories(res, result, kb_id, result => {
                exportKnowledgeBaseCategoryTranslations(res, result, kb_id, result => {
                    exportKnowledgeBaseCategoryDelayedJobs(res, result, kb_id, result => {
                        exportKnowledgeBaseArticles(res, result, kb_id, result => {
                            exportKnowledgeBaseArticleTranslations(res, result, kb_id, result => {
                                let filename = "export.csv";
                                fs.writeFile(`${__dirname}/../public/export/${filename}`, result, err => {
                                    if (err) {
                                        console.error(err)
                                        return
                                    }
                                    res.json({ status: "success", message: "File exported!", link: `http://77.68.102.60:1000/export/${filename}`});
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

function exportKnowledgeBaseData(res, data, kb_id, cb){
    pgQueries.listKnowledgeBasesById(kb_id, result => {
        if(result.err){
            result.err.errorIndex = 847239292;
            return res.status(500).json(result.err);
        }

        let knowledgebases = result.res;
        data += "[knowledge_bases]\n";
        data += "id,name,icon,footer,created_at,homepage_layout,category_layout,active,updated_at,front_page\n";
        knowledgebases.forEach(kb => {
            data+= `${kb.id},${kb.name},${kb.icon},${kb.footer},${kb.created_at},${kb.homepage_layout},${kb.category_layout},${kb.active},${kb.updated_at},${kb.front_page}\n`;
        });
        data += "\n";
        cb(data);
    });
}

function exportKnowledgeBaseTranslations(res, data, kb_id, cb){
    pgQueries.getKnowledgeBaseTranslationsById(kb_id, result => {
        if(result.err){
            result.err.errorIndex = 8472390292292;
            return res.status(500).json(result.err);
        }

        let kb_translations = result.res;
        data += "[knowledge_base_translations]\n";
        data += "id,knowledge_base_id,title,created_at,updated_at,footer_note,kb_locale_id,active\n";
        kb_translations.forEach(kb => {
            data+= `${kb.id},${kb.knowledge_base_id},${kb.title},${kb.created_at},${kb.updated_at},${kb.footer_note},${kb.kb_locale_id},${kb.active}\n`;
        });
        data += "\n";
        cb(data);
    });
}

function exportKnowledgeBaseCategories(res, data, kb_id, cb){
    pgQueries.listKnowledgeBaseCategoriesByKnowledgeBaseId(kb_id, result => {
        if(result.err){
            result.err.errorIndex = 842390292292;
            return res.status(500).json(result.err);
        }

        let kb_categories = result.res;
        data += "[knowledge_base_categories]\n";
        data += "id,knowledge_base_id,parent_id,position,created_at,updated_at\n";
        kb_categories.forEach(kb => {
            data+= `${kb.id},${kb.knowledge_base_id},${kb.parent_id},${kb.position},${kb.created_at},${kb.updated_at}\n`;
        });
        data += "\n";
        cb(data);
    });
}

function exportKnowledgeBaseCategoryTranslations(res, data, kb_id, cb){
    pgQueries.listKnowledgeBaseCategoriesByKnowledgeBaseId(kb_id, result => {
        if(result.err){
            result.err.errorIndex = 99390292292;
            return res.status(500).json(result.err);
        }

        let kb_categories = result.res;
        let numCategories = kb_categories.length;
        let count = -1;

        let kb_cat_translations = [];

        kb_categories.forEach(cat => {
            pgQueries.getKnowledgeBaseCategoryTranslationsByCategoryId(res, cat.id, (res_, result) => {
                if(result.err){
                    result.err.errorIndex = 84239029229292;
                    return res.status(500).json(result.err);
                }

                result.res.forEach(translation => {
                    kb_cat_translations.push(translation);
                });
                checkComplete();
            });
        });

        checkComplete();

        function checkComplete(){
            count++;
            if(count == numCategories){
                data += "[knowledge_base_category_translations]\n";
                data += "id,name,kb_locale_id,category_id,created_at,updated_at,ui_color,category_icon,title_tag,footer,keywords,meta_description,publish_now,active,permission\n";
                kb_cat_translations.forEach(kb => {
                    data+= `${kb.id},${kb.name},${kb.kb_locale_id},${kb.category_id},${kb.created_at},${kb.updated_at},${kb.ui_color},${kb.category_icon},${kb.title_tag},${kb.footer},${kb.keywords},${kb.meta_description},${kb.publish_now},${kb.active},${kb.permission}\n`;
                });
                data += "\n";
                cb(data);
            }
        }
    });
}

function exportKnowledgeBaseCategoryDelayedJobs(res, data, kb_id, cb){
    pgQueries.getKnowledgeBaseCategoryDelayedJobByKnowledgeBaseId(kb_id, result => {
        if(result.err){
            result.err.errorIndex = 84002292;
            return res.status(500).json(result.err);
        }
        
        let kb_delayed_jobs = result.res;
        data += "[knowledge_base_category_delayed_jobs]\n";
        data += "id,knowledge_base_category_translation_id,run_at,created_at,knowledge_base_id\n";
        kb_delayed_jobs.forEach(kb => {
            data += `${kb.id},${kb.knowledge_base_category_translation_id},${kb.run_at},${kb.created_at},${kb.knowledge_base_id}\n`;
        });
        data += "\n";
        cb(data);
    });
}

function exportKnowledgeBaseArticles(res, data, kb_id, cb){
    pgQueries.getKnowledgeBaseArticlesByKnowledgeBaseId(kb_id, result => {
        if(result.err){
            result.err.errorIndex = 8423910292292;
            return res.status(500).json(result.err);
        }

        let kb_articles = result.res;
        data += "[knowledge_base_articles]\n";
        data += "id,category_id,position,created_at,updated_at,knowledge_base_id\n";
        kb_articles.forEach(kb => {
            data+= `${kb.id},${kb.category_id},${kb.position},${kb.created_at},${kb.updated_at},${kb.knowledge_base_id}\n`;
        });
        data += "\n";
        cb(data);
    });
}

function exportKnowledgeBaseArticleTranslations(res, data, kb_id, cb){
    pgQueries.getKnowledgeBaseArticlesByKnowledgeBaseId(kb_id, result => {
        if(result.err){
            result.err.errorIndex = 99390292243;
            return res.status(500).json(result.err);
        }

        let kb_articles = result.res;
        let numArticles = kb_articles.length;
        let count = -1;

        let kb_art_translations = [];

        kb_articles.forEach(art => {
            pgQueries.getKnowledgeBaseArticleTranslationsByArticleId(art.id, result => {
                if(result.err){
                    result.err.errorIndex = 84239077832;
                    return res.status(500).json(result.err);
                }

                result.res.forEach(translation => {
                    kb_art_translations.push(translation);
                });
                checkComplete();
            });
        });

        checkComplete();

        function checkComplete(){
            count++;
            if(count == numArticles){
                data += "[knowledge_base_article_translations]\n";
                data += "id,title,kb_locale_id,created_at,updated_at,body,keywords,title_tag,meta_description,article_id,active\n";
                kb_art_translations.forEach(kb => {
                    data+= `${kb.id},${kb.title},${kb.kb_locale_id},${kb.created_at},${kb.updated_at},${kb.body},${kb.keywords},${kb.title_tag},${kb.meta_description},${kb.article_id},${kb.active}\n`;
                });
                data += "\n";
                cb(data);
            }
        }
    });
}

router.get("/clean", (req, res) => {
    pgQueries.getKnowledgeBaseCategoryTranslations(res, (res_, result) => {
        if(result.err){
            result.err.errorIndex = 77272628;
            return result.err;
        }

        let category_translations = result.res;
        let numTranslations = category_translations.length;
        let count = -1;

        category_translations.forEach(translation => {
            let values = [
                translation.name,
                translation.kb_locale_id,
                translation.category_id,
                translation.created_at,
                translation.updated_at,
                translation.ui_color,
                translation.category_icon == "\"\"" ? "": translation.category_icon,
                translation.title_tag == "\"\"" ? "": translation.title_tag,
                translation.footer,
                translation.keywords == "\"\""?"":translation.keywords,
                translation.meta_description == "\"\"" ? "":translation.meta_description,
                translation.publish_now,
                translation.active,
                translation.permission
            ];
            pgQueries.updateKnowledgeBaseCategoryTranslation(translation.category_id, translation.kb_locale_id, values, result => {
                checkComplete();
            });
        });

        checkComplete();

        function checkComplete(){
            count++;
            if(count == numTranslations){
                res.json({ status: "success", message: "Updated done" });
            }
        }
    });
});

// knowledgebases

router.patch("/setOrderForKnowledgeBases", (req, res) => {
    let order_by_knowledge_base_ids = req.body.order_by_knowledge_base_ids;

    let positionOrder = [];

    for(let i = 0; i < order_by_knowledge_base_ids.length; i++){
        positionOrder.push({
            kb_id: order_by_knowledge_base_ids[i],
            position: (i+1)
        });
    }

    let numPositions = positionOrder.length;
    let count = -1;
    
    positionOrder.forEach(order => {
        let values = [
            order.kb_id,
            order.position
        ];

        pgQueries.updatePositionForKnowledgeBase(values, result => {    
            checkComplete();
        });
    });

    checkComplete();

    function checkComplete(){
        count++;
        if(numPositions == count){
            res.json({ status: "success" });
        }
    }
});

router.get("/listKnowledgeBases/:id", (req, res) => {
    let id = req.params.id;
    pgQueries.listKnowledgeBasesById(id, result => {
        if(result.err){
            return res.json(result.err);
        }
        
        if(result.res.length == 0) return res.status(404).json({ status: 404, message: "Not found" });

        let knowledge_base = result.res[0];
        knowledge_base.locales = [];
        const kb_id = knowledge_base.id;

        // get the languages for this knowledgebase
        pgQueries.getKnowledgeBaseTranslationsById(kb_id, result1 => {
            if(result1.err){
                result1.err.errorIndex = 1;
                return res.json(result1.err);
            }

            let kb_translations = result1.res;
            let numTrans = kb_translations.length;
            let count = -1;

            kb_translations.forEach(translation => {
                let active = translation.active;
                pgQueries.getLocaleById(translation.kb_locale_id, result2 => {
                    if(result2.err){
                        result2.err.errorIndex = 1;
                        return res.json(result2.err);
                    }

                    if(result2.res.length > 0) {
                        let locale = result2.res[0];

                        knowledge_base.locales.push({
                            id: locale.id,
                            alias: locale.alias,
                            name: locale.name,
                            default: active
                        });
                    }

                    checkComplete();
                });
            });

            checkComplete();

            function checkComplete(){
                count++;
                if(count == numTrans){
                    getNumberOfSubcategoriesArticlesAndCurrentLevelForCategoryId(kb_id, -1, result => {
                        knowledge_base.stat = {
                            num_categories: result.num_categories,
                            num_articles: result.num_articles,
                            status: result.status
                        };


                        res.json(knowledge_base);
                    });
                }
            }
        });
    });
});

router.get("/listKnowledgeBases", (req, res) => {
    pgQueries.listKnowledgeBases(res, (res_, result) => {
        if(result.err){
            return res.json(result.err);
        }

        //if(result.res.length == 0) return res.status(404).json({ status: 404, message: "Not found" });

        let knowledgebases = result.res;
        let numKnowledgebases = knowledgebases.length;
        let kbCount = -1;

        knowledgebases.sort(util.sortByPosition);

        knowledgebases.forEach(knowledge_base => {
            knowledge_base.locales = [];
            const kb_id = knowledge_base.id;

            // get the languages for this knowledgebase
            pgQueries.getKnowledgeBaseTranslationsById(kb_id, result1 => {
                if(result1.err){
                    result1.err.errorIndex = 4;
                    return res.json(result1.err);
                }

                let kb_translations = result1.res;
                let numTrans = kb_translations.length;
                let count = -1;

                kb_translations.forEach(translation => {
                    let active = translation.active;
                    pgQueries.getLocaleById(translation.kb_locale_id, result2 => {
                        if(result2.err){
                            result2.err.errorIndex = 5;
                            return res.json(result2.err);
                        }

                        if(result2.res.length > 0) {
                            let locale = result2.res[0];

                            knowledge_base.locales.push({
                                id: locale.id,
                                alias: locale.alias,
                                name: locale.name,
                                default: active
                            });
                        }

                        checkComplete();
                    });
                });

                checkComplete();

                function checkComplete(){
                    count++;
                    if(count == numTrans){
                        checkKBComplete();
                    }
                }
            });
        });

        checkKBComplete();

        function checkKBComplete(){
            kbCount++;
            if(kbCount == numKnowledgebases){
                let front_pagefilteredKnowledgeBases = [];
                knowledgebases.forEach(kb => {
                    if(req.query.front_page == null){
                        front_pagefilteredKnowledgeBases.push(kb);
                    }else{
                        if(kb.front_page+"" == req.query.front_page){
                            front_pagefilteredKnowledgeBases.push(kb);
                        }
                    }
                });
                let namefilteredKnowledgeBases = [];
                if(req.query.name == null){
                    namefilteredKnowledgeBases = front_pagefilteredKnowledgeBases;
                }else{
                    front_pagefilteredKnowledgeBases.forEach(kb => {
                        if((kb.name).toLowerCase().includes((req.query.name).toLowerCase())){
                            namefilteredKnowledgeBases.push(kb);
                        }
                    });
                }

                let numFilters = namefilteredKnowledgeBases.length;
                let count1 = -1;

                namefilteredKnowledgeBases.forEach(knowledge_base => {
                    getNumberOfSubcategoriesArticlesAndCurrentLevelForCategoryId(knowledge_base.id, -1, result => {
                        knowledge_base.stat = {
                            num_categories: result.num_categories,
                            num_articles: result.num_articles,
                            status: result.status
                        };

                        checkItIsComplete();
                    });
                });

                checkItIsComplete();

                function checkItIsComplete(){
                    count1++;
                    if(count1 == numFilters){
                        res.json(util.paginate(req, namefilteredKnowledgeBases));
                    }
                }
            }
        }
    });
});

router.post("/createKnowledgeBase", (req, res) => {
    let kb_locale_ids = req.body.kb_locale_ids ? req.body.kb_locale_ids : [];

    let data = {
        name: req.body.name ? req.body.name : "",
        icon: req.body.icon ? req.body.icon : "",
        footer: req.body.footer ? req.body.footer : "",
        homepage_layout: req.body.homepage_layout ? req.body.homepage_layout: "",
        category_layout: req.body.category_layout ? req.body.category_layout: "",
        active: req.body.active != undefined ?req.body.active: true,
        front_page: req.body.front_page ?? ""
    };

    pgQueries.createKnowledgeBase(data, result => {
        if(result.err){
            return res.json(result.err);
        }

        let knowledge_base = result.res;
        let knowledge_base_id = knowledge_base.id;
        let numIds = kb_locale_ids.length;
        let count = -1;

        for(let i = 0; i < kb_locale_ids.length; i++){
            let kb_locale_id = kb_locale_ids[i];
            let position = i+1;

            getLanguageTitleFromLocaleId(kb_locale_id.id, title => {
                pgQueries.createKnowledgeBaseTranslation({
                    title: title,
                    footer_note: "",
                    kb_locale_id: kb_locale_id.id,
                    knowledge_base_id: knowledge_base_id,
                    active: kb_locale_id.default,
                    position: position,
                    ui_color: "red"
                }, result1 => {
                    if(result1.err){
                        result1.err.errorIndex = -1;
                        return res.json(result1.err);
                    }
    
                    checkComplete();
                });
            });
        }

        checkComplete();
        
        function checkComplete(){
            count++;
            if(count == numIds){
                result.res.locales = kb_locale_ids;
                recordHistory(
                    "knowledgebase", 
                    "create-knowledgebase", 
                    {
                        knowledge_base_id,
                        name: knowledge_base.name,
                        //user_id,

                    }, 
                    () => {
                        res.json(result.res);
                    }
                );
            }
        }
    });
});

router.put("/updateKnowledgeBase/:id", (req, res) => {
    let kb_locale_ids = req.body.kb_locale_ids ? req.body.kb_locale_ids : [];
    let id = req.params.id;

    let data = {
        id: id,
        name: req.body.name ? req.body.name : "",
        icon: req.body.icon ? req.body.icon : "",
        footer: req.body.footer ? req.body.footer : "",
        homepage_layout: req.body.homepage_layout ? req.body.homepage_layout: "",
        category_layout: req.body.category_layout ? req.body.category_layout: "",
        active: req.body.active != undefined ? req.body.active: true,
        front_page: req.body.front_page ?? "",
        updated_at: new Date().toUTCString()
    };

    pgQueries.updateKnowledgeBase(data, result => {
        if(result.err){
            result.err.errorIndex = 32;
            return res.json(result.err);
        }

        let knowledge_base_id = Number(id);

        pgQueries.deleteKnowledgeBaseTranslationByKnowledgeBaseId(knowledge_base_id, result1 => {
            if(result1.err){
                return res.json(result1.err);
            }

            let numIds = kb_locale_ids.length;
            let count = -1;

            for(let i = 0; i < kb_locale_ids.length; i++){
                let kb_locale_id = kb_locale_ids[i];
                let position = i+1;
    
                getLanguageTitleFromLocaleId(kb_locale_id.id, title => {
                    pgQueries.createKnowledgeBaseTranslation({
                        title: title,
                        footer_note: "",
                        kb_locale_id: kb_locale_id.id,
                        knowledge_base_id: knowledge_base_id,
                        active: kb_locale_id.default,
                        position: position,
                        ui_color: "red"
                    }, result2 => {
                        if(result2.err){
                            result1.err.errorIndex = -2;
                            return res.json(result2.err);
                        }
        
                        checkComplete();
                    });
                });
            }
    
            checkComplete();
            
            function checkComplete(){
                count++;
                if(count == numIds){
                    updateUIColorForKnowledgeBase(knowledge_base_id, () => {
                        recordHistory(
                            "knowledgebase", 
                            "update-knowledgebase", 
                            {
                                knowledge_base_id,
                                name: req.body.name,
                                //user_id,
        
                            }, 
                            () => {
                                res.json({ status: "success", message: "Knowledge base updated" });
                            }
                        );
                    });
                }
            }
        });
    });
});

router.delete("/deleteKnowledgeBase/:id", (req, res) => {
    let id = req.params.id;

    let values = [
        id,
        true
    ];

    pgQueries.updateKnowledgeBaseArchivedStatus(values, result => {
        pgQueries.updateKnowledgeBaseTranslationArchivedStatusByKBId(values, result => {
            pgQueries.updateKnowledgeBaseCategoriesArchivedStatusByKBId(values, result => {
                pgQueries.updateKnowledgeBaseCategoryTranslationsArchivedStatusByKBId(values, result => {
                    pgQueries.updateKnowledgeBaseArticlesArchivedStatusByKBId(values, result => {
                        pgQueries.updateKnowledgeBaseArticleTranslationsArchivedStatusByKBId(values, result => {
                            updateUIColorForKnowledgeBase(id, () => {
                                recordHistory(
                                    "knowledgebase", 
                                    "archive-knowledgebase", 
                                    {
                                        knowledge_base_id: id,
                                        //user_id,
                
                                    }, 
                                    () => {
                                        res.json({ status: "success", message: "Knowledge base deleted successfully" });
                                    }
                                );
                            });
                        });
                    });
                });
            });
        });
    });
});

router.get("/getKnowledgeBaseLanguageSelectionList/knowledge_base_id/:knowledge_base_id", (req, res) => {
    let knowledge_base_id = req.params.knowledge_base_id;

    // get the knowledge base languages
    pgQueries.getKnowledgeBaseTranslationsByKnowledgeBaseId(knowledge_base_id, result => {
        if(result.err){
            result.err.errorIndex = -1;
            return res.json(result.err);
        }

        let kb_translations = result.res;
        pgQueries.listLocales(result => {
            if(result.err){
                result.err.errorIndex = 8;
                return res.json(result.err);
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

            res.json(to_return);
        });
    });
});


// knowledgebase translations

router.patch("/setOrderForKnowledgeBaseTranslations", (req, res) => {
    let order_by_knowledge_base_translation_ids = req.body.order_by_knowledge_base_translation_ids;

    let positionOrder = [];

    for(let i = 0; i < order_by_knowledge_base_translation_ids.length; i++){
        positionOrder.push({
            kb_id: order_by_knowledge_base_translation_ids[i],
            position: (i+1)
        });
    }

    let numPositions = positionOrder.length;
    let count = -1;
    
    positionOrder.forEach(order => {
        let values = [
            order.kb_id,
            order.position
        ];

        pgQueries.updatePositionForKnowledgeBaseTranslation(values, result => {    
            checkComplete();
        });
    });

    checkComplete();

    function checkComplete(){
        count++;
        if(numPositions == count){
            recordHistory(
                "knowledgebase", 
                "reorder-knowledgebasetranslation", 
                {
                    order_by_knowledge_base_translation_ids,
                    //user_identity
                }, 
                () => {
                    res.json({ status: "success" });
                }
            );
        }
    }
});

router.get("/getKnowledgeBaseTranslations/knowledge_base_id/:id", (req, res) => {
    let knowledge_base_id = req.params.id;
    pgQueries.getKnowledgeBaseTranslationsByKnowledgeBaseId(knowledge_base_id, result => {
        if(result.err){
            result.errorIndex = 3726282;
            return res.status(500).json(result.err);
        }
        let kb_translations = result.res;
        kb_translations.sort(util.sortByPosition);
        kb_translations.sort((a, b) => {
            return a.active ? -1 : 1;
        });
        res.json(kb_translations);
    });
});

/*
router.get("/listKnowledgeBaseTranslations", (req, res) => {
    pgQueries.listKnowledgeBaseTranslations(res, (res_, result) => {
        if(result.err){
            result.errorIndex = 72621;
            return res.status(500).json(result.err);
        }

        let kb_translations = result.res;
        kb_translations.sort(util.sortByUpdatedAt);
        res.json(kb_translations);
    });
});

router.post("/createKnowledgeBaseTranslation", (req, res) => {
    let data = getKnowledgeBaseTranslationData(req);

    pgQueries.createKnowledgeBaseTranslation(res, data, returnResult);
});

function getKnowledgeBaseTranslationData(req){
    return {
        title: req.body.title ? req.body.title : "",
        footer_note: req.body.footer_note ? req.body.footer_note : "",
        kb_locale_id: req.body.kb_locale_id ? req.body.kb_locale_id : 1,
        updated_at: req.body.updated_at ? req.body.updated_at : new Date().toUTCString(),
        knowledge_base_id: req.body.knowledge_base_id ? req.body.knowledge_base_id: 0,
        active: req.body.active != undefined ? req.body.active: false,
        ui_color: req.body.ui_color ? req.body.ui_color : "red"
    };
}

router.put("/updateKnowledgeBaseTranslation/:id", (req, res) => {
    let id = req.params.id;
    let data = getKnowledgeBaseTranslationData(req);
    data.id = id;

    pgQueries.updateKnowledgeBaseTranslation(data, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Knowledge base translation updated" });
    });
});

router.delete("/deleteKnowledgeBaseTranslation/:id", (req, res) => {
    let id = req.params.id;

    let data = {
        id: id
    };

    pgQueries.deleteKnowledgeBaseTranslation(data, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Knowledge base translation deleted successfully" });
    });
});
*/

// automate the process
router.get("/automateCategories", (req, res) => {
    return res.json({ status: "Out of service"});
    let parent_id = 542;
    let kb_locale_id = 1;

    let subcategoriesName = [
        "Private Jet Pilot",
        "Single Engine Helicopter Pilot",
        "Twin Engine Helicopter Pilot"
    ];

    pgQueries.getKnowledgeBaseCategoryTranslationByLocaleId(kb_locale_id, result => {
        if(result.err){
            result.err.errorIndex = "abfsdsx";
            return res.json(result.err);
        }

        let translations = result.res;
        let numTranslations = translations.length;
        let count = -1;

        translations.forEach(translation => {
            subcategoriesName.forEach(name => {
                if(translation.name.toLowerCase().trim().includes(name.toLowerCase().trim())){
                    let category_id = translation.category_id;

                    pgQueries.updateKnowledgeBaseCategoryParentIdById(category_id, parent_id, result => {
                        if(result.err){
                            result.err.errorIndex = "asbfsdsx";
                            return res.json(result.err);
                        }
                        checkComplete();
                    });
                }else{
                    checkComplete();
                }
            });
        });

        checkComplete();

        function checkComplete(){
            count++;
            if(count == numTranslations){
                res.json({ status: "Done!"});
            }
        }
    });
});


router.get("/getAllKnowledgeBaseCategories/knowledge_base_id/:knowledge_base_id/kb_locale_id/:kb_locale_id", (req, res) => {
    let knowledge_base_id = req.params.knowledge_base_id;
    let kb_locale_id = req.params.kb_locale_id;
    let parent_id = -1;

    getCategoriesAndSubCategories(req, res, knowledge_base_id, kb_locale_id, parent_id, -1, categories => {
        res.json(categories);
    });
});

router.get("/getAllKnowledgeBaseSubCategories/category_id/:category_id/kb_locale_id/:kb_locale_id", (req, res) => {
    let category_id = req.params.category_id;
    let kb_locale_id = req.params.kb_locale_id;

    //get knowledge base id from category id
    pgQueries.listKnowledgeBaseCategoriesById(category_id, result1 => {
        if(result1.err){
            result1.err.errorIndex = 484733;
            return res.json(result1.err);
        }

        let category = result1.res[0];
        let knowledge_base_id = category.knowledge_base_id;
        getCategoriesAndSubCategories(req, res, knowledge_base_id, kb_locale_id, category_id, null, categories => {
            res.json(categories);
        });
    });
});


function getCategoriesAndSubCategories(req, res, knowledge_base_id, kb_locale_id, parent_id, kb_trans_parent_id, cb){
    pgQueries.getKnowledgeBaseCategoriesByKnowledgeBaseIdAndParentId(knowledge_base_id, parent_id, result => {
        if(result.err){
            result.err.errorIndex = "sds";
            return res.json(result.err);
        }
    
        let kb_category_translations = [];
    
        let kbCategories = result.res;
        let numCategories = kbCategories.length;
        let count = -1;
    
        kbCategories.forEach(kbCategory => {
            pgQueries.getKnowledgeBaseCategoryTranslationsByCategoryIdAndLocaleId(kbCategory.id, kb_locale_id, result2 => {
                if(result2.err){
                    result2.err.errorIndex = 322;
                    return res.json(result2.err);
                }
    
                if(result2.res.length == 0){
                    checkComplete();
                }else{
                    let kbCategoryTranslation = result2.res[0];

                    kbCategoryTranslation.position = kbCategory.position;
                    kbCategoryTranslation.kb_trans_parent_id = kb_trans_parent_id;
                    kbCategoryTranslation.parent_id = parent_id;
                    kbCategoryTranslation.schedule_at = null;

                    getNumberOfSubcategoriesArticlesAndCurrentLevelForCategoryId(knowledge_base_id, kbCategory.id, result => {
                        kbCategoryTranslation.stat = {
                            level: result.level,
                            num_categories: result.num_categories,
                            num_articles: result.num_articles
                        };

                        if(kbCategoryTranslation.publish_now){
                            kb_category_translations.push(kbCategoryTranslation);
                            checkComplete();
                        }else{
                            pgQueries.getKnowledgeBaseCategoryDelayedJobByKnowledgeBaseCategoryTranslationId(kbCategoryTranslation.id, result1 => {
                                if(result1.err){
                                    result1.err.errorIndex = 3220;
                                    return res.json(result1.err);
                                }

                                kbCategoryTranslation.schedule_at = null;
                                if(result1.res.length > 0){
                                    kbCategoryTranslation.schedule_at = result1.res[0].run_at;
                                }
                                kb_category_translations.push(kbCategoryTranslation);
        
        
                                checkComplete();
                            });
                        }
                    });
        
                }
            });
        });
    
        checkComplete();
    
        function checkComplete(){
            count++;
            if(count == numCategories){
                kb_category_translations.sort(util.sortByPosition);
                let numCategoryTrans = kb_category_translations.length;
                count = -1;
                kb_category_translations.forEach(kbCategoryTrans => {
                    let category_id = kbCategoryTrans.category_id;
                    let kb_trans_parent_id = kbCategoryTrans.id;
                    getCategoriesAndSubCategories(req, res, knowledge_base_id, kb_locale_id, category_id, kb_trans_parent_id, categories => {
                        kbCategoryTrans.subcategories = [];
                        if(categories.length > 0){
                            kbCategoryTrans.subcategories = categories;
                        }
                        checkComplete2();
                    });
                });

                checkComplete2();

                function checkComplete2(){
                    count++;
                    if(count == numCategoryTrans){
                        cb(kb_category_translations);
                    }
                }
            }
        }
    });
}

router.get("/getKnowledgeBaseCategoryList/knowledge_base_id/:knowledge_base_id/kb_locale_id/:kb_locale_id/list_name/:group", (req, res) => {
    let knowledge_base_id = req.params.knowledge_base_id;
    let kb_locale_id = req.params.kb_locale_id;
    let parent_id = -1;
    let group = req.params.group;

    getCategoriesAndSubCategoriesForGroup(req, res, knowledge_base_id, kb_locale_id, parent_id, null, group, categories => {
        res.json(categories);
    });
});

router.get("/getKnowledgeBaseSubCategoryList/knowledge_base_id/:knowledge_base_id/parent_id/:parent_id/kb_locale_id/:kb_locale_id/list_name/:group", (req, res) => {
    let knowledge_base_id = req.params.knowledge_base_id;
    let kb_locale_id = req.params.kb_locale_id;
    let parent_id = req.params.parent_id;
    let group = req.params.group;

    getCategoriesAndSubCategoriesForGroup2(req, res, knowledge_base_id, kb_locale_id, parent_id, null, group, categories => {
        res.json(categories);
    });
});

function getCategoriesAndSubCategoriesForGroup2(req, res, knowledge_base_id, kb_locale_id, parent_id, kb_trans_parent_id, group, cb){
    pgQueries.getKnowledgeBaseCategoriesByKnowledgeBaseIdAndParentId(knowledge_base_id, parent_id, result => {
        if(result.err){
            result.err.errorIndex = "ssds";
            return res.json(result.err);
        }
    
        let kb_category_translations = [];
    
        let kbCategories = result.res;
        let numCategories = kbCategories.length;
        let count = -1;
    
        kbCategories.forEach(kbCategory => {
            pgQueries.getKnowledgeBaseCategoryTranslationsByCategoryIdAndLocaleId(kbCategory.id, kb_locale_id, result2 => {
                if(result2.err){
                    result2.err.errorIndex = 322;
                    return res.json(result2.err);
                }
    
                if(result2.res.length == 0){
                    checkComplete();
                }else{
                    let kbCategoryTranslation = result2.res[0];

                    kbCategoryTranslation.position = kbCategory.position;
                    kbCategoryTranslation.kb_trans_parent_id = kb_trans_parent_id;
                    kbCategoryTranslation.parent_id = parent_id;
                    
                    getNumberOfSubcategoriesArticlesAndCurrentLevelForCategoryId(knowledge_base_id, kbCategory.id, result => {
                        kbCategoryTranslation.stat = {
                            level: result.level,
                            num_categories: result.num_categories,
                            num_articles: result.num_articles
                        };

                        if(kbCategoryTranslation.group_name.toLowerCase().includes(group.toLowerCase())){
                            kbCategoryTranslation.schedule_at = null;
            
                            if(kbCategoryTranslation.publish_now){
                                kb_category_translations.push(kbCategoryTranslation);
                                checkComplete();
                            }else{
                                pgQueries.getKnowledgeBaseCategoryDelayedJobByKnowledgeBaseCategoryTranslationId(kbCategoryTranslation.id, result1 => {
                                    if(result1.err){
                                        result1.err.errorIndex = 3220;
                                        return res.json(result1.err);
                                    }
                    
                                    kbCategoryTranslation.schedule_at = null;
                                    if(result1.res.length > 0){
                                        kbCategoryTranslation.schedule_at = result1.res[0].run_at;
                                    }
                                    kb_category_translations.push(kbCategoryTranslation);
            
            
                                    checkComplete();
                                });
                            }
                        }else{
                            checkComplete();
                        }    
                    });   
                }
            });
        });
    
        checkComplete();
    
        function checkComplete(){
            count++;
            if(count == numCategories){
                kb_category_translations.sort(util.sortByPosition);
                let numCategoryTrans = kb_category_translations.length;
                count = -1;
                kb_category_translations.forEach(kbCategoryTrans => {
                    let category_id = kbCategoryTrans.category_id;
                    let kb_trans_parent_id = kbCategoryTrans.id;
                    getCategoriesAndSubCategories(req, res, knowledge_base_id, kb_locale_id, category_id, kb_trans_parent_id, categories => {
                        kbCategoryTrans.subcategories = [];
                        if(categories.length > 0){
                            kbCategoryTrans.subcategories = categories;
                        }
                        checkComplete2();
                    });
                });

                checkComplete2();

                function checkComplete2(){
                    count++;
                    if(count == numCategoryTrans){
                        cb(kb_category_translations);
                    }
                }
            }
        }
    });
}

function getCategoriesAndSubCategoriesForGroup(req, res, knowledge_base_id, kb_locale_id, parent_id, kb_trans_parent_id, group, cb){
    pgQueries.getKnowledgeBaseCategoriesByKnowledgeBaseIdAndParentId(knowledge_base_id, parent_id, result => {
        if(result.err){
            result.err.errorIndex = "ssds";
            return res.json(result.err);
        }
    
        let kb_category_translations = [];
    
        let kbCategories = result.res;
        let numCategories = kbCategories.length;
        let count = -1;
    
        kbCategories.forEach(kbCategory => {
            pgQueries.getKnowledgeBaseCategoryTranslationsByCategoryIdAndLocaleId(kbCategory.id, kb_locale_id, result2 => {
                if(result2.err){
                    result2.err.errorIndex = 322;
                    return res.json(result2.err);
                }
    
                if(result2.res.length == 0){
                    checkComplete();
                }else{
                    let kbCategoryTranslation = result2.res[0];

                    kbCategoryTranslation.position = kbCategory.position;
                    kbCategoryTranslation.kb_trans_parent_id = kb_trans_parent_id;
                    kbCategoryTranslation.parent_id = parent_id;

                    getNumberOfSubcategoriesArticlesAndCurrentLevelForCategoryId(knowledge_base_id, kbCategory.id, result => {
                        kbCategoryTranslation.stat = {
                            level: result.level,
                            num_categories: result.num_categories,
                            num_articles: result.num_articles
                        };
                    
                        if(parent_id == -1){
                            if(kbCategoryTranslation.group_name.toLowerCase().includes(group.toLowerCase())){
                                kbCategoryTranslation.schedule_at = null;
                
                                if(kbCategoryTranslation.publish_now){
                                    kb_category_translations.push(kbCategoryTranslation);
                                    checkComplete();
                                }else{
                                    pgQueries.getKnowledgeBaseCategoryDelayedJobByKnowledgeBaseCategoryTranslationId(kbCategoryTranslation.id, result1 => {
                                        if(result1.err){
                                            result1.err.errorIndex = 3220;
                                            return res.json(result1.err);
                                        }
                        
                                        kbCategoryTranslation.schedule_at = null;
                                        if(result1.res.length > 0){
                                            kbCategoryTranslation.schedule_at = result1.res[0].run_at;
                                        }
                                        kb_category_translations.push(kbCategoryTranslation);
                
                
                                        checkComplete();
                                    });
                                }
                            }else{
                                checkComplete();
                            }
                        }else{
                            kbCategoryTranslation.schedule_at = null;
                
                            if(kbCategoryTranslation.publish_now){
                                kb_category_translations.push(kbCategoryTranslation);
                                checkComplete();
                            }else{
                                pgQueries.getKnowledgeBaseCategoryDelayedJobByKnowledgeBaseCategoryTranslationId(kbCategoryTranslation.id, result1 => {
                                    if(result1.err){
                                        result1.err.errorIndex = 3220;
                                        return res.json(result1.err);
                                    }
                    
                                    kbCategoryTranslation.schedule_at = null;
                                    if(result1.res.length > 0){
                                        kbCategoryTranslation.schedule_at = result1.res[0].run_at;
                                    }
                                    kb_category_translations.push(kbCategoryTranslation);
            
            
                                    checkComplete();
                                });
                            }
                        }
                    });
                }
            });
        });
    
        checkComplete();
    
        function checkComplete(){
            count++;
            if(count == numCategories){
                kb_category_translations.sort(util.sortByPosition);
                let numCategoryTrans = kb_category_translations.length;
                count = -1;
                kb_category_translations.forEach(kbCategoryTrans => {
                    let category_id = kbCategoryTrans.category_id;
                    let kb_trans_parent_id = kbCategoryTrans.id;
                    getCategoriesAndSubCategories(req, res, knowledge_base_id, kb_locale_id, category_id, kb_trans_parent_id, categories => {
                        kbCategoryTrans.subcategories = [];
                        if(categories.length > 0){
                            kbCategoryTrans.subcategories = categories;
                        }
                        checkComplete2();
                    });
                });

                checkComplete2();

                function checkComplete2(){
                    count++;
                    if(count == numCategoryTrans){
                        cb(kb_category_translations);
                    }
                }
            }
        }
    });
}

// knowledgebase category
router.get("/getKnowledgeBaseCategories/knowledge_base_id/:knowledge_base_id/kb_locale_id/:kb_locale_id", (req, res) => {
    let knowledge_base_id = req.params.knowledge_base_id;
    let kb_locale_id = req.params.kb_locale_id;
    let parent_id = req.query.parent_id ? Number(req.query.parent_id) : -1;

    pgQueries.getKnowledgeBaseCategoriesByKnowledgeBaseIdAndParentId(knowledge_base_id, parent_id, result => {
        if(result.err){
            result.err.errorIndex = "abx";
            return res.json(result.err);
        }

        let kb_category_translations = [];

        let kbCategories = result.res;
        let numCategories = kbCategories.length;
        let count = -1;

        kbCategories.forEach(kbCategory => {
            pgQueries.getKnowledgeBaseCategoryTranslationsByCategoryIdAndLocaleId(kbCategory.id, kb_locale_id, result2 => {
                if(result2.err){
                    result2.err.errorIndex = 322;
                    return res.json(result2.err);
                }

                if(result2.res.length == 0){
                    checkComplete();
                }else{
                    let kbCategoryTranslation = result2.res[0];

                    kbCategoryTranslation.position = kbCategory.position;

                    kbCategoryTranslation.schedule_at = null;

                    getNumberOfSubcategoriesArticlesAndCurrentLevelForCategoryId(knowledge_base_id, kbCategory.id, result => {
                        kbCategoryTranslation.stat = {
                            level: result.level,
                            num_categories: result.num_categories,
                            num_articles: result.num_articles
                        };
        
                        if(kbCategoryTranslation.publish_now){
                            kb_category_translations.push(kbCategoryTranslation);
                            checkComplete();
                        }else{
                            pgQueries.getKnowledgeBaseCategoryDelayedJobByKnowledgeBaseCategoryTranslationId(kbCategoryTranslation.id, result1 => {
                                if(result1.err){
                                    result1.err.errorIndex = 3220;
                                    return res.json(result1.err);
                                }
                
                                kbCategoryTranslation.schedule_at = null;
                                if(result1.res.length > 0){
                                    kbCategoryTranslation.schedule_at = result1.res[0].run_at;
                                }
                                kb_category_translations.push(kbCategoryTranslation);


                                checkComplete();
                            });
                        }
                    });
                }
            });
        });

        checkComplete();

        function checkComplete(){
            count++;
            if(count == numCategories){
                kb_category_translations.sort(util.sortByPosition);
                res.json(util.paginate(req, kb_category_translations));
            }
        }
    });
});

router.get("/getKnowledgeBaseSubCategories/knowledge_base_id/:knowledge_base_id/parent_id/:parent_id", (req, res) => {
    let knowledge_base_id = req.params.knowledge_base_id;
    let parent_id = req.params.parent_id;

    pgQueries.getKnowledgeBaseCategoriesByKnowledgeBaseIdAndParentId(knowledge_base_id, parent_id, result => {
        if(result.err){
            result.err.errorIndex = "abxs";
            return res.json(result.err);
        }

        let kbCategories = result.res;

        kbCategories.forEach(kbCategory => {
            getNumberOfSubcategoriesArticlesAndCurrentLevelForCategoryId(knowledge_base_id, kbCategory.id, result => {
                kbCategory.stat = {
                    level: result.level,
                    num_categories: result.num_categories,
                    num_articles: result.num_articles
                };
            });
        });

        kbCategories.sort(util.sortByPosition);
        res.json(kbCategories);
    });
});

router.get("/getKnowledgeBaseCategoryTranslation/category_id/:category_id/kb_locale_id/:kb_locale_id", (req, res) => {
    let category_id = req.params.category_id;
    let kb_locale_id = req.params.kb_locale_id;

    pgQueries.listKnowledgeBaseCategoriesById(category_id, result1 => {
        if(result1.err){
            result1.err.errorIndex = 484733;
            return res.json(result1.err);
        }

        let category = result1.res[0];

        pgQueries.getKnowledgeBaseCategoryTranslationByCategoryIdAndLocaleId(category_id, kb_locale_id, result => {
            if(result.err){
                return res.json(result.err);
            }
    
            if(result.res.length == 0) return res.status(404).json({ status: 404, message: "Not found" });
    
            let translation = result.res[0];
            translation.parent_id = category.parent_id;
            translation.knowledge_base_id = category.knowledge_base_id;
            translation.position = category.position;

            getNumberOfSubcategoriesArticlesAndCurrentLevelForCategoryId(category.knowledge_base_id, category.id, result => {
                translation.stat = {
                    level: result.level,
                    num_categories: result.num_categories,
                    num_articles: result.num_articles
                };
                res.json(translation);
            });
            
        });
    });
});

router.get("/listKnowledgeBaseCategories/:id", (req, res) => {
    let category_id = req.params.id;
    pgQueries.listKnowledgeBaseCategoriesById(category_id, result => {
        if(result.err){
            result.err.errorIndex = 38475;
            return res.json(result.err);
        }
        if(result.res.length == 0) return res.status(404).json({ status: 404, message: "Category not found" });

        res.json(result.res[0]);
    });
});

router.patch("/setOrderForKnowledgeBaseCategories", (req, res) => {
    let order_by_category_ids = req.body.order_by_category_ids;

    let positionOrder = [];

    for(let i = 0; i < order_by_category_ids.length; i++){
        positionOrder.push({
            category_id: order_by_category_ids[i],
            position: (i+1)
        });
    }

    let numPositions = positionOrder.length;
    let count = -1;
    
    positionOrder.forEach(order => {
        let values = [
            order.category_id,
            order.position
        ];

        pgQueries.updatePositionForKnowledgeBaseCategory(values, result => {    
            checkComplete();
        });
    });

    checkComplete();

    function checkComplete(){
        count++;
        if(numPositions == count){
            res.json({ status: "success" });
        }
    }
});

router.get("/listKnowledgeBaseCategoriesForKnowledgeBase/:id", (req, res) => {
    let knowledge_base_id = req.params.id;
    pgQueries.listKnowledgeBaseCategoriesByKnowledgeBaseId(knowledge_base_id, result => {
        if(result.err){
            return res.json(result.err);
        }

        result.res.sort(util.sortByPosition);

        res.json(result.res);
    });
});

router.get("/listKnowledgeBaseCategories", (req, res) => {
    pgQueries.listKnowledgeBaseCategories(res, (res_, result) => {
        if(result.err){
            result.err.errorIndex = 76264392;
            return res.status(500).json(result.err);
        }

        result.res.sort(util.sortByPosition);

        res.json(result.res);
    });
});

router.post("/createKnowledgeBaseCategory", (req, res) => {
    let category_id = req.body.category_id ? req.body.category_id : null;
    let knowledge_base_id = req.body.knowledge_base_id ?? null;
    let parent_id = req.body.parent_id ?? -1;

    // prevent the categories from being scheduled for publication at a time in the past
    let publish_now = req.body.publish_now != undefined ? req.body.publish_now : true;
    let schedule_at = req.body.schedule_at;

    if(!publish_now){
        if(schedule_at != null){
            let scheduled_date = new Date(schedule_at);
            if(scheduled_date.getTime() < Date.now()){
                return res.status(405).json({ status: "error", message: "You cannot schedule to publish a category in the past" });
            }
        }
    }

    if(category_id == null){
        
        function createKnowledgeBaseCategory(){
            let values = getKnowledgeBaseCategoryData(req);
    
            pgQueries.createKnowledgeBaseCategory(values, result=> {
                if(result.err){
                    return res.json(result.err);
                }
                let kb = result.res;
                req.body.category_id = kb.id;
    
                createKnowledgeBaseCategoryTranslation(req, res, kb);
            });
        }

        if(parent_id == null || parent_id == -1){
            createKnowledgeBaseCategory();
        }else{
            getNumberOfSubcategoriesArticlesAndCurrentLevelForCategoryId(knowledge_base_id, parent_id, result => {
                if(result.level <= 4){
                    createKnowledgeBaseCategory();
                }else{
                    res.status(401).json({ status: "Not allowed", message: "Limit reached" });
                }
            });
        }
    }else{
        pgQueries.listKnowledgeBaseCategoriesById(Number(category_id), result => {
            if(result.err){
                return res.json(result.err);
            }

            if(result.res.length == 0) return res.status(404).json({ status: 404, message: "Not found" });

            let kb = result.res[0];
            req.body.category_id = category_id;

            createKnowledgeBaseCategoryTranslation(req, res, kb);
        });
    }
});

router.get("/getScheduleForKnowledgeBaseCategory/:kb_cat_trans_id/:type", (req, res) => {
    let kb_cat_trans_id = req.params.kb_cat_trans_id;
    let type = req.params.type;

    pgQueries.getKnowledgeBaseCategoryDelayedJob(kb_cat_trans_id, type, result => {
        if(result.err){
            return res.json(result.err);
        }

        res.json(result.res);
    });
});

router.get("/getScheduleForKnowledgeBaseArticle/:kb_art_trans_id/:type", (req, res) => {
    let kb_art_trans_id = req.params.kb_art_trans_id;
    let type = req.params.type;

    pgQueries.getKnowledgeBaseArticleDelayedJob(kb_art_trans_id, type, result => {
        if(result.err){
            return res.json(result.err);
        }

        res.json(result.res);
    });
});

router.post("/scheduleKnowledgeBaseCategoryUpdate", (req, res) => {
    let knowledge_base_category_translation_id = req.body.knowledge_base_category_translation_id;
    let run_at = req.body.run_at;
    let knowledge_base_id = req.body.update_metadata.knowledge_base_id;
    let update_metadata = JSON.stringify(req.body.update_metadata);

    // prevent the categories from being scheduled at a time in the past
   
    if(run_at != null){
        let run_at_date = new Date(run_at);
        if(run_at_date.getTime() < Date.now()){
            return res.status(405).json({ status: "error", message: "You cannot schedule to update a category in the past" });
        }
    }

    let values = [
        knowledge_base_category_translation_id,
        true,
        update_metadata,
        "white"
    ];

    pgQueries.updateKnowledgeBaseCategoryTranslationUpdateSchedule(values, result => {
        if(result.err){
            return res.json(result.err);
        }

        let values1 = [
            knowledge_base_category_translation_id,
            run_at,
            knowledge_base_id,
            "update"
        ];

        pgQueries.createKnowledgeBaseCategoryDelayedJob(values1, result => {
            if(result.err){
                return res.json(result.err);
            }

            res.json({ status: "success", message: "Knowledge base category translation scheduled for updated" });
        });
    });
});

router.post("/scheduleKnowledgeBaseCategoryDelete", (req, res) => {
    let knowledge_base_category_translation_id = req.body.knowledge_base_category_translation_id;
    let knowledge_base_id = req.body.knowledge_base_id;
    let run_at = req.body.run_at;

    if(run_at != null){
        let run_at_date = new Date(run_at);
        if(run_at_date.getTime() < Date.now()){
            return res.status(405).json({ status: "error", message: "You cannot schedule to delete a category in the past" });
        }
    }

    let values = [
        knowledge_base_category_translation_id,
        run_at,
        knowledge_base_id,
        "delete"
    ];

    pgQueries.createKnowledgeBaseCategoryDelayedJob(values, result => {
        if(result.err){
            return res.json(result.err);
        }

        values = [
            knowledge_base_category_translation_id,
            true,
            "yellow"
        ];

        pgQueries.updateKnowledgeBaseCategoryTranslationDeleteSchedule(values, result => {
            if(result.err){
                result.err.errorIndex = 36221;
                return res.json(result.err);
            }

            res.json({ status: "success", message: "Knowledge base category translation scheduled for deletion" });
        });
    });
});

function createKnowledgeBaseCategoryTranslation(req, res, kb){
    let publish_now = req.body.publish_now != undefined ? req.body.publish_now : false;

    pgQueries.getKnowledgeBaseTranslationsByKnowledgeBaseId(req.body.knowledge_base_id, result => {
        if(result.err){
            result.err.errorIndex = 302;
            return res.json(result.err);
        }

        let kb_translations = result.res;

        let numTranslations = kb_translations.length;
        let count = -1;

        kb_translations.forEach(kb_translation => {
            let kb_locale_id = kb_translation.kb_locale_id;
            
            let values = getKnowledgeBaseCategoryTranslationData(req);
            values[1] = kb_locale_id;
            if(kb_locale_id == req.body.kb_locale_id){
                if(!req.body.active){
                    if(!req.body.publish_now){
                        values[5] = "blue";
                    }else{
                        values[5] = "orange";
                    }
                }else{
                    values[5] = "green";
                }
            }else{
                values[5] = "red";
            }
            values.push(req.body.is_delete_scheduled != undefined ? req.body.is_delete_scheduled : false);
            values.push(req.body.is_update_scheduled != undefined ? req.body.is_update_scheduled : false);
            values.push(req.body.knowledge_base_id);
            pgQueries.createKnowledgeBaseCategoryTranslation(values, result => {
                if(result.err){
                    result.err.errorIndex = 302;
                    return res.json(result.err);
                }
        
                let kb_category_translation_id = result.res.id;
        
                if(publish_now){
                    checkComplete();
                }else{
                    let run_at = req.body.schedule_at ? req.body.schedule_at : new Date().toUTCString();
        
                    let values3 = [
                        kb_category_translation_id,
                        run_at,
                        req.body.knowledge_base_id,
                        "publish"
                    ];
                    pgQueries.createKnowledgeBaseCategoryDelayedJob(values3, result1 => {
                        if(result1.err){
                            return res.json(result1.err);
                        }
        
                        kb.schedule_at = result1.res.run_at; 
        
                        checkComplete();
                    });
                }
            });
        });

        checkComplete();

        function checkComplete(){
            count++;
            if(numTranslations == count){
                updateUIColorForKnowledgeBase(req.body.knowledge_base_id, () => {
                    recordHistory(
                        "knowledgebase", 
                        "create-knowledgebasecategory", 
                        {
                            knowledge_base_id: req.body.knowledge_base_id,
                            kb_locale_id: req.body.kb_locale_id
                            //user_identity
                        }, 
                        () => {
                            res.json(kb);
                        }
                    );
                });
            }
        }
    });
}

function getLanguageTitleFromLocaleId(locale_id, cb){
    pgQueries.getLocaleById(locale_id, result => {
        if(result.err){
            return cb("");
        }

        cb(result.res[0].name);
    });
}

function getKnowledgeBaseLanguages(kb_id, cb){
    pgQueries.getKnowledgeBaseTranslationsById(kb_id, result => {
        if(result.err){
            return cb([]);
        }

        cb(result.res);
    });
}

function getKnowledgeBaseCategoryData(req){
    return [
        req.body.knowledge_base_id ? req.body.knowledge_base_id : 1,
        req.body.parent_id ? req.body.parent_id : -1,
        req.body.position ? req.body.position: -1,
        req.body.created_at ? req.body.created_at : new Date().toUTCString(),
        req.body.updated_at ? req.body.updated_at : new Date().toUTCString()
    ];
}

function getKnowledgeBaseCategoryTranslationData(req){
    return [
        req.body.name ? req.body.name : "",
        req.body.kb_locale_id ? req.body.kb_locale_id : 1,
        req.body.category_id ? req.body.category_id : 1,
        req.body.created_at ? req.body.created_at : new Date().toUTCString(),
        req.body.updated_at ? req.body.updated_at : new Date().toUTCString(),
        req.body.ui_color ? req.body.ui_color : "red",
        req.body.category_icon ? req.body.category_icon : "",
        req.body.title_tag ? req.body.title_tag : "",
        req.body.footer ? req.body.footer : "",
        req.body.keywords ? req.body.keywords : "",
        req.body.meta_description ? req.body.meta_description : "",
        req.body.publish_now != undefined ? req.body.publish_now : true,
        req.body.active != undefined ? req.body.active : true,
        req.body.permission ? req.body.permission : "",
        req.body.group_name ? req.body.group_name : ""
    ];
}

router.put("/updateKnowledgeBaseCategory/category_id/:category_id/kb_locale_id/:kb_locale_id", (req, res) => {
    let category_id = Number(req.params.category_id);
    let kb_locale_id = Number(req.params.kb_locale_id);

    // prevent the categories from being scheduled for publication at a time in the past
    let publish_now = req.body.publish_now != undefined ? req.body.publish_now : true;
    let schedule_at = req.body.schedule_at;

    if(!publish_now){
        if(schedule_at != null){
            let scheduled_date = new Date(schedule_at);
            if(scheduled_date.getTime() < Date.now()){
                return res.status(405).json({ status: "error", message: "You cannot schedule to publish a category in the past" });
            }
        }
    }

    let values = getKnowledgeBaseCategoryData(req);
    values.push(category_id);

    pgQueries.updateKnowledgeBaseCategory(values, result => {
        if(result.err){
            result.err.errorIndex = 374849;
            return res.json(result.err);
        }

        let values1 = getKnowledgeBaseCategoryTranslationData(req);
        if(!req.body.active){
            if(!req.body.publish_now){
                values1[5] = "blue";
            }else{
                values1[5] = "orange";
            }
        }else{
            values1[5] = "green";
        }
        values1.push(req.body.knowledge_base_id);

        pgQueries.updateKnowledgeBaseCategoryTranslation(category_id, kb_locale_id, values1, result => {
            if(result.err){
                result.err.errorIndex = 83782;
                return res.json(result.err);
            }

            let knowledge_base_category_translation = result.res;
            let knowledge_base_category_translation_id = knowledge_base_category_translation.id;

            pgQueries.deleteKnowledgeBaseCategoryDelayedJobByScheduleType([knowledge_base_category_translation_id, "publish"], result2 => {
                if(result2.err){
                    result2.err.errorIndex = 736282;
                    return res.json(result2.err);
                }
    
                if(publish_now){
                    res.json(knowledge_base_category_translation);
                }else{
                    let run_at = req.body.schedule_at ? req.body.schedule_at : new Date().toUTCString();
        
                    let values = [
                        knowledge_base_category_translation_id,
                        run_at,
                        req.body.knowledge_base_id,
                        "publish"
                    ];
                    pgQueries.createKnowledgeBaseCategoryDelayedJob(values, result1 => {
                        if(result1.err){
                            return res.json(result1.err);
                        }
        
                        updateUIColorForKnowledgeBase(req.body.knowledge_base_id, () => {
                            recordHistory(
                                "knowledgebase", 
                                "update-knowledgebasecategory", 
                                {
                                    knowledge_base_id: req.body.knowledge_base_id,
                                    category_id,
                                    kb_locale_id
                                    //user_identity
                                }, 
                                () => {
                                    res.json(knowledge_base_category_translation);
                                }
                            );
                        });
                    });
                }
            });
        });
    });
});

router.patch("/archiveKnowledgeBaseCategory/:category_id", (req, res) => {
    let category_id = req.params.category_id;
    archiveSubCategory(category_id, () => {
        res.json({ status: "success", message: "Successfully archived"});
    });
});

function archiveSubCategory(category_id, cb){
    let values1 = [
        category_id,
        true
    ];

    let values2 = [
        category_id,
        true,
        "gray"
    ];
    
    pgQueries.updateKnowledgeBaseCategoriesArchivedStatusByCategoryId(values1, result => {
        pgQueries.updateKnowledgeBaseCategoryTranslationsArchivedStatusByCategoryId(values2, result => {
            pgQueries.updateKnowledgeBaseArticlesArchivedStatusByCategoryId(values1, result => {
                pgQueries.updateKnowledgeBaseArticleTranslationsArchivedStatusByCategoryId(values2, result => {
                    //determine if there are sub categories to this category
                    pgQueries.getKnowledgeBaseCategoriesByParentId(category_id, result => {
                        if(result.res.length == 0) return cb();

                        let categories = result.res;
                        let numCategories = categories.length;
                        let count = -1;

                        categories.forEach(category => {
                            archiveSubCategory(category.id, () => {
                                checkComplete();
                            });
                        });

                        checkComplete();

                        function checkComplete(){
                            count++;
                            if(count == numCategories){
                                cb();
                            }
                        }
                    });
                });
            });
        });
    });
}

router.patch("/unarchiveKnowledgeBaseCategory/:category_id", (req, res) => {
    let category_id = req.params.category_id;
    pgQueries.listKnowledgeBaseCategoriesById(category_id, result => {
        let category = result.res[0];
        let knowledge_base_id = category.knowledge_base_id;
        if(category.parent_id == -1){
            pgQueries.listKnowledgeBasesById(knowledge_base_id, result => {
                let kb = result.res[0];

                if(kb == null || kb.is_archived){
                    // check if the knowledge base is archived
                    res.status(401).json({ status: "error", message: "The knowledge base is already archived or is unavailable"});
                }else{
                    unarchiveSubCategory(knowledge_base_id, category_id, () => {
                        res.json({ status: "success", message: "Successfully unarchived"});
                    });
                }
            });
        }else{
            pgQueries.listKnowledgeBaseCategoriesById(category.parent_id, result => {
                let parent_category = result.res[0];
                if(parent_category == null || parent_category.is_archived){
                    res.status(401).json({ status: "error", message: "The parent is already archived or is unavailable"});
                }else{
                    // the parent is not archived
                    unarchiveSubCategory(knowledge_base_id, category_id, () => {
                        res.json({ status: "success", message: "Successfully unarchived"});
                    });
                }
            });
        }
    });
});

function unarchiveSubCategory(knowledge_base_id, category_id, cb){
    let values1 = [
        category_id,
        false
    ];

    let values2 = [
        category_id,
        false,
        "red"
    ];
    
    pgQueries.updateKnowledgeBaseCategoriesArchivedStatusByCategoryId(values1, result => {
        pgQueries.updateKnowledgeBaseCategoryTranslationsArchivedStatusByCategoryId(values2, result => {
            pgQueries.updateKnowledgeBaseArticlesArchivedStatusByCategoryId(values1, result => {
                pgQueries.updateKnowledgeBaseArticleTranslationsArchivedStatusByCategoryId(values2, result => {
                    updateUIColorForKnowledgeBaseCategoriesAndArticles(knowledge_base_id, category_id, () => {
                        //determine if there are sub categories to this category
                        pgQueries.getKnowledgeBaseCategoriesByParentId(category_id, result => {
                            if(result.res.length == 0) return cb();
    
                            let categories = result.res;
                            let numCategories = categories.length;
                            let count = -1;
    
                            categories.forEach(category => {
                                unarchiveSubCategory(knowledge_base_id, category.id, () => {
                                    checkComplete();
                                });
                            });
    
                            checkComplete();
    
                            function checkComplete(){
                                count++;
                                if(count == numCategories){
                                    cb();
                                }
                            }
                        });
                    });
                });
            });
        });
    });
}

router.delete("/deleteKnowledgeBaseCategory/:category_id", (req, res) => {
    let category_id = req.params.category_id;

    let values = [
        category_id,
        true,
        "gray"
    ];

    pgQueries.updateKnowledgeBaseCategoriesArchivedStatusByCategoryId(values, result => {
        pgQueries.updateKnowledgeBaseCategoryTranslationsArchivedStatusByCategoryId(values, result => {
            pgQueries.updateKnowledgeBaseArticlesArchivedStatusByCategoryId(values, result => {
                pgQueries.updateKnowledgeBaseArticleTranslationsArchivedStatusByCategoryId(values, result => {
                    recordHistory(
                        "knowledgebase", 
                        "delete-knowledgebasecategory", 
                        {
                            category_id
                            //user_identity
                        }, 
                        () => {
                            res.json({ status: "success", message: "Knowledge base deleted successfully" });
                        }
                    );
                });
            });
        });
    });
});

// knowledgebase category translation
router.get('/getKnowledgeBaseCategoryTranslationsByCategoryId/:category_id', (req, res) => {
    let category_id = req.params.category_id;

    pgQueries.listKnowledgeBaseCategoriesById(category_id, result1 => {
        if(result1.err){
            result1.err.errorIndex = 38475933;
            return res.json(result1.err.errorIndex);
        }

        if(result1.res.length == 0) return res.status(404).json({ status: 404, message: "Category not found" });

        let category = result1.res[0];

        if(category.is_archived) return res.json([]);

        pgQueries.getKnowledgeBaseCategoryTranslationsByCategoryId(res, category_id, (res_, result) => {
            if(result.err){
                result.err.errorIndex = 3847593;
                return res.json(result.err.errorIndex);
            }

            if(result.res.length == 0) return res.status(404).json({ status: 404, message: "Category translations not found" });
    
            let translations = result.res;
            let numTranslations = translations.length;
            let count = -1;
    
            translations.forEach(translation => {
                translation.parent_id = category.parent_id;
                translation.knowledge_base_id = category.knowledge_base_id;
                translation.position = category.position;
                checkComplete();
            });

            checkComplete();
    
            function checkComplete(){
                count++;
                if(count == numTranslations){
                    res.json(translations);
                }
            }
        });
    });
});

router.get('/getKnowledgeBaseCategoryTranslations', (req, res) => {
    pgQueries.getKnowledgeBaseCategoryTranslations(res, returnResult);
});

router.delete("/deleteKnowledgeBaseCategoryTranslation/:id", (req, res) => {
    let id = req.params.id;

    let values = [
        id,
        true
    ];

    pgQueries.updateKnowledgeBaseCategoryTranslationsArchivedStatusById(values, result => {
        res.json({ status: "success", message: "Knowledge base category translation deleted successfully" });
    });
});








// knowledgebase articles
router.get("/getKnowledgeBaseArticles/category_id/:category_id/kb_locale_id/:kb_locale_id", (req, res) => {
    let category_id = req.params.category_id;
    let kb_locale_id = req.params.kb_locale_id;

    pgQueries.getKnowledgeBaseArticlesByKnowledgeBaseCategoryId(category_id, result => {
        if(result.err){
            result.err.errorIndex = 3821473;
            return res.status(500).json(result.err);
        }

        if(result.res.length == 0) return res.json([]);

        let articles_return = [];
        let articles = result.res;
        let numArticles = articles.length;
        let count = -1;


        articles.forEach(article => {
            if(article.is_archived){
                checkComplete();
            }else{
                pgQueries.getKnowledgeBaseArticleTranslationByArticleIdAndLocaleId(article.id, kb_locale_id, result => {
                    if(result.err){
                        result.err.errorIndex = 88892;
                        return res.status(500).json(result.err);
                    }
        
                    if(result.res.length > 0){
                        let article_translation = result.res[0];
            
                        if(!article_translation.is_archived){
                            article_translation.knowledge_base_id = article.knowledge_base_id;
                            article_translation.category_id = article.category_id;
            
                            articles_return.push(article_translation);
                        }
                    }
                    
                    checkComplete();
                });
            }
        });


        checkComplete();

        function checkComplete(){
            count++;
            if(count == numArticles){
                articles_return.sort(util.sortByUpdatedAt);
                res.json(articles_return);
            }
        }
    });
});

router.get("/getKnowledgeBaseArticles/knowledge_base_id/:knowledge_base_id/category_id/:category_id/kb_locale_id/:kb_locale_id", (req, res) => {
    let knowledge_base_id = req.params.knowledge_base_id;
    let category_id = req.params.category_id;
    let kb_locale_id = req.params.kb_locale_id;

    pgQueries.getKnowledgeBaseArticlesByKnowledgeBaseIdAndCategoryId([knowledge_base_id, category_id], result => {
        if(result.err){
            result.err.errorIndex = 3821473;
            return res.status(500).json(result.err);
        }

        if(result.res.length == 0) return res.json([]);

        let articles_return = [];
        let articles = result.res;
        let numArticles = articles.length;
        let count = -1;


        articles.forEach(article => {
            if(article.is_archived){
                checkComplete();
            }else{
                pgQueries.getKnowledgeBaseArticleTranslationByArticleIdAndLocaleId(article.id, kb_locale_id, result => {
                    if(result.err){
                        result.err.errorIndex = 88892;
                        return res.status(500).json(result.err);
                    }
        
                    if(result.res.length > 0){
                        let article_translation = result.res[0];
            
                        if(!article_translation.is_archived){
                            article_translation.knowledge_base_id = article.knowledge_base_id;
                            article_translation.category_id = article.category_id;
            
                            articles_return.push(article_translation);
                        }
                    }
                    
                    checkComplete();
                });
            }
        });


        checkComplete();

        function checkComplete(){
            count++;
            if(count == numArticles){
                articles_return.sort(util.sortByUpdatedAt);
                res.json(util.paginate(req, articles_return));
            }
        }
    });
});

router.get("/getAllKnowledgeBaseArticleTranslations/knowledge_base_id/:knowledge_base_id/kb_locale_id/:kb_locale_id", (req, res) => {
    let knowledge_base_id = req.params.knowledge_base_id;
    let kb_locale_id = req.params.kb_locale_id;

    let values = [
        knowledge_base_id,
        kb_locale_id
    ];

    pgQueries.getAllKnowledgeBaseArticlesByKnowledgeBaseIdAndLocaleId(values, result => {
        if(result.err){
            result.err.errorIndex = 3821473;
            return res.status(500).json(result.err);
        }

        let article_translations = result.res;

        res.json(article_translations);
    });
});

router.get("/getAllKnowledgeBaseArticleList/category_id/:category_id/kb_locale_id/:kb_locale_id/list_name/:list_name", (req, res) => {
    let category_id = req.params.category_id;
    let kb_locale_id = req.params.kb_locale_id;
    let list_name = req.params.list_name;

    pgQueries.getKnowledgeBaseArticlesByKnowledgeBaseCategoryId(category_id, result => {
        if(result.err){
            result.err.errorIndex = 3821473;
            return res.status(500).json(result.err);
        }

        if(result.res.length == 0) return res.json([]);

        let articles_return = [];
        let articles = result.res;
        let numArticles = articles.length;
        let count = -1;


        articles.forEach(article => {
            if(article.is_archived){
                checkComplete();
            }else{
                pgQueries.getKnowledgeBaseArticleTranslationByArticleIdAndLocaleId(article.id, kb_locale_id, result => {
                    if(result.err){
                        result.err.errorIndex = 88892;
                        return res.status(500).json(result.err);
                    }
        
                    if(result.res.length > 0){
                        let article_translation = result.res[0];
            
                        if(!article_translation.is_archived){
                            if(article_translation.list_name.toLowerCase().includes(list_name.toLowerCase())){
                                article_translation.knowledge_base_id = article.knowledge_base_id;
                                article_translation.category_id = article.category_id;
                
                                articles_return.push(article_translation);
                            }
                        }
                    }
                    
                    checkComplete();
                });
            }
        });


        checkComplete();

        function checkComplete(){
            count++;
            if(count == numArticles){
                articles_return.sort(util.sortByPosition);
                res.json(articles_return);
            }
        }
    });
});

router.patch("/setOrderForKnowledgeBaseArticles", (req, res) => {
    let order_by_article_ids = req.body.order_by_article_ids;

    let positionOrder = [];

    for(let i = 0; i < order_by_article_ids.length; i++){
        positionOrder.push({
            article_id: order_by_article_ids[i],
            position: (i+1)
        });
    }

    let numPositions = positionOrder.length;
    let count = -1;
    
    positionOrder.forEach(order => {
        let values = [
            order.article_id,
            order.position
        ];

        pgQueries.updatePositionForKnowledgeBaseArticle(values, result => {    
            checkComplete();
        });
    });

    checkComplete();

    function checkComplete(){
        count++;
        if(numPositions == count){
            res.json({ status: "success" });
        }
    }
});

router.get("/getKnowledgeBaseArticleTranslation/article_id/:article_id/kb_locale_id/:kb_locale_id", (req, res) => {
    let article_id = req.params.article_id;
    let kb_locale_id = req.params.kb_locale_id;

    pgQueries.getKnowledgeBaseArticlesById(article_id, result => {
        if(result.err){
            result.err.errorIndex = 38473;
            return res.status(500).json(result.err);
        }

        if(result.res.length == 0) return res.status(404).json({ status: 404, message: "Article not found" });

        let article = result.res[0];

        if(article.is_archived) return res.status(401).json({ status: 401, message: "Article deleted" });

        pgQueries.getKnowledgeBaseArticleTranslationByArticleIdAndLocaleId(article_id, kb_locale_id, result => {
            if(result.err){
                result.err.errorIndex = 88892;
                return res.status(500).json(result.err);
            }

            if(result.res.length == 0) return res.status(404).json({ status: 404, message: "Article translation not found" });

            let article_translation = result.res[0];

            if(article_translation.is_archived) return res.status(401).json({ status: 401, message: "Article deleted" });

            article_translation.knowledge_base_id = article.knowledge_base_id;
            article_translation.category_id = article.category_id;

            res.json(article_translation);
        });
    });
});

router.get("/listKnowledgeBaseArticles", (req, res) => {
    pgQueries.listKnowledgeBaseArticles(res, (res_, result) => {
        if(result.err){
            result.err.errorIndex = 3827211;
            return res.status(500).json(result.err);
        }

        result.res.sort(util.sortByPosition);

        res.json(result.res);
    });
});


router.post("/scheduleKnowledgeBaseArticleUpdate", (req, res) => {
    let knowledge_base_article_translation_id = req.body.knowledge_base_article_translation_id;
    let run_at = req.body.run_at;
    let knowledge_base_id = req.body.update_metadata.knowledge_base_id;
    let article_id = req.body.update_metadata.article_id;
    let update_metadata = JSON.stringify(req.body.update_metadata);

    if(run_at != null){
        let run_at_date = new Date(run_at);
        if(run_at_date.getTime() < Date.now()){
            return res.status(405).json({ status: "error", message: "You cannot schedule to update an article in the past" });
        }
    }

    let values = [
        knowledge_base_article_translation_id,
        true,
        update_metadata
    ];

    pgQueries.updateKnowledgeBaseArticleTranslationUpdateSchedule(values, result => {
        if(result.err){
            result.err.errorIndex = 38272;
            return res.json(result.err);
        }

        let values3 = [
            knowledge_base_id,
            article_id,
            knowledge_base_article_translation_id,
            run_at,
            "update"
        ];

        pgQueries.createKnowledgeBaseArticleDelayedJob(values3, result1 => {
            if(result1.err){
                return res.json(result1.err);
            }


            recordHistory(
                "knowledgebase", 
                "schedule-update-knowledgebasearticle", 
                {
                    knowledge_base_id,
                    knowledge_base_article_translation_id,
                    run_at,
                    article_id,
                    update_metadata
                    //user_identity
                }, 
                () => {
                    res.json({ status: "success", message: "Knowledge base article translation scheduled for updated" });
                }
            );

        });
    });
});

router.post("/scheduleKnowledgeBaseArticleDelete", (req, res) => {
    let knowledge_base_article_translation_id = req.body.knowledge_base_article_translation_id;
    let run_at = req.body.run_at;
    let knowledge_base_id = req.body.knowledge_base_id;
    let article_id = req.body.article_id;

    if(run_at != null){
        let run_at_date = new Date(run_at);
        if(run_at_date.getTime() < Date.now()){
            return res.status(405).json({ status: "error", message: "You cannot schedule to delete an article in the past" });
        }
    }

    let values3 = [
        knowledge_base_id,
        article_id,
        knowledge_base_article_translation_id,
        run_at,
        "delete"
    ];

    pgQueries.createKnowledgeBaseArticleDelayedJob(values3, result1 => {
        if(result1.err){
            result1.err.errorIndex = 3277;
            return res.json(result1.err);
        }

        values = [
            knowledge_base_article_translation_id,
            true
        ];

        pgQueries.updateKnowledgeBaseArticleTranslationDeleteSchedule(values, result => {
            if(result.err){
                result.err.errorIndex = 306221;
                return res.json(result.err);
            }

            recordHistory(
                "knowledgebase", 
                "schedule-delete-knowledgebasearticle", 
                {
                    knowledge_base_id,
                    knowledge_base_article_translation_id,
                    run_at,
                    article_id
                    //user_identity
                }, 
                () => {
                    res.json({ status: "success", message: "Knowledge base article translation scheduled for deletion" });
                }
            );
        });
    });
});

router.delete("/removeScheduleForKnowledgebaseArticle/:knowledge_base_article_translation_id/:schedule_type", (req, res) => {
    let schedule_type = req.params.schedule_type;
    if(!["publish","update","delete"].find(type => type == schedule_type)) return res.json({ status: "error", message: "schedule type must be 'publish','update', or 'delete'"});
    let knowledge_base_article_translation_id = req.params.knowledge_base_article_translation_id;

    let values = [
        knowledge_base_article_translation_id,
        schedule_type
    ];
    pgQueries.deleteKnowledgeBaseArticleDelayedJobByScheduleType(values, result => {
        if(result.err){
            result.err.errorIndex = 3277;
            return res.json(result.err);
        }

        switch(schedule_type){
            case "delete":
                values = [
                    knowledge_base_article_translation_id,
                    false
                ];
                pgQueries.updateKnowledgeBaseArticleTranslationDeleteSchedule(values, result => {
                    if(result.err){
                        result.err.errorIndex = 38621;
                        return res.json(result.err);
                    }

                    recordHistory(
                        "knowledgebase", 
                        "remove-schedule-delete-knowledgebasearticle", 
                        {
                            knowledge_base_article_translation_id
                            //user_identity
                        }, 
                        () => {
                            res.json({ status: "success", message: "Removed schedule to delete article" });
                        }
                    );
                });
            break;

            case "publish":
                // update the publish_now variable in knowledge_base_article_translation
                values = [
                    knowledge_base_article_translation_id,
                    true,
                    true
                ];
                pgQueries.updateKnowledgeBaseArticleTranslationPublishSchedule(values, result => {
                    if(result.err){
                        result.err.errorIndex = 31277;
                        return res.json(result.err);
                    }

                    recordHistory(
                        "knowledgebase", 
                        "remove-schedule-publish-knowledgebasearticle", 
                        {
                            knowledge_base_article_translation_id
                            //user_identity
                        }, 
                        () => {
                            res.json({ status: "success", message: "Removed schedule to publish article" });
                        }
                    );
                });
            break;

            case "update":
                // update the metadata variable in knowledge_base_article_translation
                values = [
                    knowledge_base_article_translation_id,
                    false,
                    ""
                ];
                pgQueries.updateKnowledgeBaseArticleTranslationUpdateSchedule(values, result => {
                    if(result.err){
                        result.err.errorIndex = 31277;
                        return res.json(result.err);
                    }

                    recordHistory(
                        "knowledgebase", 
                        "remove-schedule-update-knowledgebasearticle", 
                        {
                            knowledge_base_article_translation_id
                            //user_identity
                        }, 
                        () => {
                            res.json({ status: "success", message: "Removed schedule to update article" });
                        }
                    );
                });
            break;
        }
    });
});

router.delete("/removeScheduleForKnowledgebaseCategory/:knowledge_base_category_translation_id/:schedule_type", (req, res) => {
    let schedule_type = req.params.schedule_type;
    if(!["publish","update","delete"].find(type => type == schedule_type)) return res.json({ status: "error", message: "schedule type must be 'publish','update', or 'delete'"});
    let knowledge_base_category_translation_id = req.params.knowledge_base_category_translation_id;

    let values = [
        knowledge_base_category_translation_id,
        schedule_type
    ];
    pgQueries.deleteKnowledgeBaseCategoryDelayedJobByScheduleType(values, result => {
        if(result.err){
            result.err.errorIndex = 3277;
            return res.json(result.err);
        }

        switch(schedule_type){
            case "delete":
                values = [
                    knowledge_base_category_translation_id,
                    false,
                    "green"
                ];
                pgQueries.updateKnowledgeBaseCategoryTranslationDeleteSchedule(values, result => {
                    if(result.err){
                        result.err.errorIndex = 3621;
                        return res.json(result.err);
                    }

                    recordHistory(
                        "knowledgebase", 
                        "remove-schedule-delete-knowledgebasecategory", 
                        {
                            knowledge_base_category_translation_id
                            //user_identity
                        }, 
                        () => {
                            res.json({ status: "success", message: "Removed schedule to delete category" });
                        }
                    );
                });

            break;

            case "publish":
                // update the publish_now variable in knowledge_base_category_translation
                values = [
                    knowledge_base_category_translation_id,
                    true,
                    true
                ];
                pgQueries.updateKnowledgeBaseCategoryTranslationPublishSchedule(values, result => {
                    if(result.err){
                        result.err.errorIndex = 31277;
                        return res.json(result.err);
                    }

                    recordHistory(
                        "knowledgebase", 
                        "remove-schedule-publish-knowledgebasecategory", 
                        {
                            knowledge_base_category_translation_id
                            //user_identity
                        }, 
                        () => {
                            res.json({ status: "success", message: "Removed schedule to publish category" });
                        }
                    );
                    
                });
            break;

            case "update":
                // update the metadata variable in knowledge_base_category_translation
                values = [
                    knowledge_base_category_translation_id,
                    false,
                    "",
                    "green"
                ];
                pgQueries.updateKnowledgeBaseCategoryTranslationUpdateSchedule(values, result => {
                    if(result.err){
                        result.err.errorIndex = 31277;
                        return res.json(result.err);
                    }

                    recordHistory(
                        "knowledgebase", 
                        "remove-schedule-update-knowledgebasecategory", 
                        {
                            knowledge_base_category_translation_id
                            //user_identity
                        }, 
                        () => {
                            res.json({ status: "success", message: "Removed schedule to update category" });
                        }
                    );

                });
            break;
        }
    });
});

router.post("/createKnowledgeBaseArticle", (req, res) => {
    let article_id = req.body.article_id ? req.body.article_id : null;

    // prevent the categories from being scheduled for publication at a time in the past
    let publish_now = req.body.publish_now != undefined ? req.body.publish_now : true;
    let schedule_at = req.body.schedule_at;

    if(!publish_now){
        if(schedule_at != null){
            let scheduled_date = new Date(schedule_at);
            if(scheduled_date.getTime() < Date.now()){
                return res.status(405).json({ status: "error", message: "You cannot schedule to publish an article in the past" });
            }
        }
    }

    if(article_id == null){
        let data = getKnowledgeBaseArticleData(req);
        pgQueries.createKnowledgeBaseArticle(data, result => {
            if(result.err){
                result.err.errorIndex = 3847322;
                return res.json(result.err.errorIndex);
            }

            let article = result.res;

            req.body.article_id = article.id;

            createKnowledgeBaseArticleTranslation(req, res, article);
        });
    }else{
        pgQueries.getKnowledgeBaseArticlesById(article_id, result => {
            if(result.err){
                result.err.errorIndex = 3847322;
                return res.json(result.err.errorIndex);
            }

            if(result.res.length == 0) return res.status(404).json({ status: 404, message: "Not found" });

            let article = result.res[0];

            req.body.article_id = article.id;

            createKnowledgeBaseArticleTranslation(req, res, article);
        });
    }
});

function createKnowledgeBaseArticleTranslation(req, res, article){
    let publish_now = req.body.publish_now != undefined ? req.body.publish_now : true;

    pgQueries.getKnowledgeBaseTranslationsByKnowledgeBaseId(req.body.knowledge_base_id, result => {
        if(result.err){
            result.err.errorIndex = 302;
            return res.json(result.err);
        }

        let kb_translations = result.res;

        let numTranslations = kb_translations.length;
        let count = -1;

        kb_translations.forEach(kb_translation => {
            let kb_locale_id = kb_translation.kb_locale_id;

            let data = getKnowledgeBaseArticleTranslationData(req);
            data.kb_locale_id = kb_locale_id;
            data.category_id = req.body.category_id;
            data.knowledge_base_id = req.body.knowledge_base_id;
            if(kb_locale_id == req.body.kb_locale_id){
                if(!req.body.active){
                    if(!req.body.publish_now){
                        data.ui_color = "blue";
                    }else{
                        data.ui_color = "orange";
                    }
                }else{
                    data.ui_color = "green";
                }
            }else{
                data.ui_color = "red";
            }
            pgQueries.createKnowledgeBaseArticleTranslation(data, result => {
                if(result.err){
                    result.err.errorIndex = 2847322;
                    return res.json(result.err.errorIndex);
                }
        
                let articleTranslation = result.res;
        
                recordHistory(
                    "knowledgebase", 
                    "create-knowledgebasearticle", 
                    {
                        knowledge_base_id: req.body.knowledge_base_id,
                        kb_locale_id: req.body.kb_locale_id,
                        title: req.body.title
                        //user_identity
                    }, 
                    () => {
                        if(publish_now){
                            res.json(articleTranslation);
                        }else{
                            let knowledge_base_id = req.body.knowledge_base_id;
                            let article_id = req.body.article_id;
                            let translation_id = articleTranslation.id;
                            let run_at = req.body.schedule_at ?? new Date().toUTCString();
                
                            let values3 = [
                                knowledge_base_id,
                                article_id,
                                translation_id,
                                run_at,
                                "publish"
                            ];
                            pgQueries.createKnowledgeBaseArticleDelayedJob(values3, result1 => {
                                if(result1.err){
                                    return res.json(result1.err);
                                }
                
                                articleTranslation.schedule_at = result1.res.run_at; 
                
                                res.json(articleTranslation);
                            });
                        }
                    }
                );
            });
        });

        checkComplete();

        function checkComplete(){
            count++;
            if(numTranslations == count){
                updateUIColorForKnowledgeBase(req.body.knowledge_base_id, () => {
                    res.json(article);
                });
            }
        }
    });
}

function getKnowledgeBaseArticleData(req){
    return {
        knowledge_base_id: req.body.knowledge_base_id ? req.body.knowledge_base_id : 0,
        category_id: req.body.category_id ? req.body.category_id : -1,
        position: req.body.position ? req.body.position: -1,
        updated_at: req.body.updated_at ? req.body.updated_at: new Date().toUTCString(),
        created_at: req.body.created_at ? req.body.created_at: new Date().toUTCString()
    };
}

function getKnowledgeBaseArticleTranslationData(req){
    return {
        title: req.body.title ? req.body.title : "",
        kb_locale_id: req.body.kb_locale_id ? req.body.kb_locale_id : 0,
        created_at: req.body.created_at ? req.body.created_at: new Date().toUTCString(),
        updated_at: req.body.updated_at ? req.body.updated_at: new Date().toUTCString(),
        body: req.body.body ? req.body.body : "",
        keywords: req.body.keywords ? req.body.keywords : "",
        title_tag: req.body.title_tag ? req.body.title_tag : "",
        meta_description: req.body.meta_description ? req.body.meta_description : "",
        article_id: req.body.article_id ? req.body.article_id : -1,
        active: req.body.active != undefined ? req.body.active : true,
        publish_now: req.body.publish_now != undefined ? req.body.publish_now : true,
        is_delete_scheduled: req.body.is_delete_scheduled != undefined ? req.body.is_delete_scheduled : false,
        is_update_scheduled: req.body.is_update_scheduled != undefined ? req.body.is_update_scheduled : false,
        list_name: req.body.list_name ? req.body.list_name : ""
    };
}

router.put("/updateKnowledgeBaseArticleTranslation/article_id/:article_id/kb_locale_id/:kb_locale_id", (req, res) => {
    let article_id = Number(req.params.article_id);
    let kb_locale_id = Number(req.params.kb_locale_id);

    // prevent the categories from being scheduled for publication at a time in the past
    let publish_now = req.body.publish_now != undefined ? req.body.publish_now : true;
    let schedule_at = req.body.schedule_at;

    if(!publish_now){
        if(schedule_at != null){
            let scheduled_date = new Date(schedule_at);
            if(scheduled_date.getTime() < Date.now()){
                return res.status(405).json({ status: "error", message: "You cannot schedule to update an article in the past" });
            }
        }
    }

    let data = getKnowledgeBaseArticleData(req);

    pgQueries.updateKnowledgeBaseArticle(article_id, data, result => {
        if(result.err){
            result.err.errorIndex = 37487849;
            return res.json(result.err);
        }

        let data1 = getKnowledgeBaseArticleTranslationData(req);
        data1.category_id = req.body.category_id;
        data1.knowledge_base_id = req.body.knowledge_base_id;
        if(!req.body.active){
            if(!req.body.publish_now){
                data1.ui_color = "blue";
            }else{
                data1.ui_color = "orange";
            }
        }else{
            data1.ui_color = "green";
        }

        pgQueries.updateKnowledgeBaseArticleTranslation(article_id, kb_locale_id, data1, result => {
            if(result.err){
                result.err.errorIndex = 83782;
                return res.json(result.err);
            }

            let knowledge_base_article_translation = result.res;
            let knowledge_base_article_translation_id = knowledge_base_article_translation.id;

            pgQueries.deleteKnowledgeBaseArticleDelayedJob([knowledge_base_article_translation_id], result2 => {
                if(result2.err){
                    return res.json(result2.err);
                }
    
                recordHistory(
                    "knowledgebase", 
                    "update-knowledgebasearticle", 
                    {
                        article_id,
                        kb_locale_id
                        //user_identity
                    }, 
                    () => {
                        if(publish_now){
                            res.json(knowledge_base_article_translation);
                        }else{
                            let knowledge_base_id = req.body.knowledge_base_id;
                            let translation_id = knowledge_base_article_translation_id.id;
                            let run_at = req.body.schedule_at ?? new Date().toUTCString();
        
                            let values3 = [
                                knowledge_base_id,
                                article_id,
                                translation_id,
                                run_at,
                                "publish"
                            ];
                            pgQueries.createKnowledgeBaseArticleDelayedJob(values3, result1 => {
                                if(result1.err){
                                    return res.json(result1.err);
                                }
        
                                knowledge_base_article_translation.schedule_at = result1.res.run_at; 
        
                                res.json(knowledge_base_article_translation);
                            });
                        }
                    }
                );

            });
        });
    });
});

router.put("/updateKnowledgeBaseArticle/:id", (req, res) => {
    let id = req.params.id;
    let data = getKnowledgeBaseArticleData(req);

    // prevent the categories from being scheduled for publication at a time in the past
    let publish_now = req.body.publish_now != undefined ? req.body.publish_now : true;
    let schedule_at = req.body.schedule_at;

    if(!publish_now){
        if(schedule_at != null){
            let scheduled_date = new Date(schedule_at);
            if(scheduled_date.getTime() < Date.now()){
                return res.status(405).json({ status: "error", message: "You cannot schedule to update an article in the past" });
            }
        }
    }

    pgQueries.updateKnowledgeBaseArticle(id, data, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Knowledge base article updated" });
    });
});

router.delete("/deleteKnowledgeBaseArticle/:id", (req, res) => {
    let id = req.params.id;

    let values = [
        id,
        true
    ];

    pgQueries.updateKnowledgeBaseArticlesArchivedStatusByArticleId(values, result => {
        pgQueries.updateKnowledgeBaseArticleTranslationsArchivedStatusByArticleId(values, result => {
            recordHistory(
                "knowledgebase", 
                "archive-knowledgebasearticle", 
                {
                    article_id: id
                    //user_identity
                }, 
                () => {
                    res.json({ status: "success", message: "Knowledge base article deleted successfully" });
                }
            );
        });
    });
});











// knowledgebase answer translations
router.get("/listKnowledgeBaseArticleTranslations", (req, res) => {
    pgQueries.listKnowledgeBaseArticleTranslations(res, returnResult);
});

router.post("/createKnowledgeBaseArticleTranslation", (req, res) => {
    let title = req.body.title ? req.body.title : "";
    let kb_locale_id = req.body.kb_locale_id ? req.body.kb_locale_id : -1;
    let article_id = req.body.article_id ? req.body.article_id : -1;
    let content_id = req.body.content_id ? req.body.content_id: -1;
    let created_by_id = req.body.created_by_id ? req.body.created_by_id: -1;
    let updated_by_id = req.body.updated_by_id ? req.body.updated_by_id: -1;

    if(title == ""){
        return res.json({ status: "error", message: "Please specify the title for this knowledge base article translation" });
    }

    let data = {
        title: title,
        kb_locale_id: kb_locale_id,
        article_id: article_id,
        content_id: content_id,
        created_by_id: created_by_id,
        updated_by_id: updated_by_id
    };

    pgQueries.createKnowledgeBaseArticleTranslation(res, data, returnResult);
});

router.put("/updateKnowledgeBaseArticleTranslation/:id", (req, res) => {
    let id = req.params.id;
    let title = req.body.title ? req.body.title : "";
    let kb_locale_id = req.body.kb_locale_id ? req.body.kb_locale_id : -1;
    let article_id = req.body.article_id ? req.body.article_id : -1;
    let content_id = req.body.content_id ? req.body.content_id: -1;
    let created_by_id = req.body.created_by_id ? req.body.created_by_id: -1;
    let updated_by_id = req.body.updated_by_id ? req.body.updated_by_id: -1;
    let updated_at = new Date().toUTCString();

    if(title == ""){
        return res.json({ status: "error", message: "Please specify the title for this knowledge base article translation" });
    }

    let data = {
        id: id,
        title: title,
        kb_locale_id: kb_locale_id,
        article_id: article_id,
        content_id: content_id,
        created_by_id: created_by_id,
        updated_by_id: updated_by_id,
        updated_at: updated_at
    };

    pgQueries.updateKnowledgeBaseArticleTranslation(data, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Knowledge base article translation updated" });
    });
});

router.delete("/deleteKnowledgeBaseArticleTranslation/:id", (req, res) => {
    let id = req.params.id;

    let data = {
        id: id
    };

    pgQueries.deleteKnowledgeBaseArticleTranslation(data, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Knowledge base article translation deleted successfully" });
    });
});

// locales
router.get("/listLocales", (req, res) => {
    pgQueries.listLocales(result => {
        if(result.err){
            result.err.errorIndex = 8;
            return res.json(result.err);
        }
        res.json(result.res);
    });
});

router.post("/createLocale", (req, res) => {
    let locale = req.body.locale ? req.body.locale : "";
    let alias = req.body.alias ? req.body.alias : "";
    let name = req.body.name ? req.body.name: "";
    let dir = req.body.dir ? req.body.dir: "ltr";
    let active = req.body.active ? req.body.active: true;

    if(locale == ""){
        return res.json({ status: "error", message: "Please specify the locale" });
    }

    let data = {
        locale: locale,
        alias: alias,
        name: name,
        dir: dir,
        active: active
    };

    pgQueries.createLocale(res, data, returnResult);
});

router.put("/updateLocale/:id", (req, res) => {
    let id = req.params.id;
    let locale = req.body.locale ? req.body.locale : "";
    let alias = req.body.alias ? req.body.alias : "";
    let name = req.body.name ? req.body.name: "";
    let dir = req.body.dir ? req.body.dir: "ltr";
    let active = req.body.active ? req.body.active: true;
    let updated_at = new Date().toUTCString();

    if(locale == ""){
        return res.json({ status: "error", message: "Please specify the locale" });
    }

    let data = {
        id: id,
        locale: locale,
        alias: alias,
        name: name,
        dir: dir,
        active: active,
        updated_at: updated_at
    };

    pgQueries.updateLocale(data, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Locale updated" });
    });
});

router.delete("/deleteLocale/:id", (req, res) => {
    let id = req.params.id;

    let data = {
        id: id
    };

    pgQueries.deleteLocale(data, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Locale deleted successfully" });
    });
});


// knowledgebase_locales
router.get("/listKnowledgeBaseLocales", (req, res) => {
    pgQueries.listKnowledgeBaseLocales(res, returnResult);
});

router.post("/createKnowledgeBaseLocales", (req, res) => {
    let knowledge_base_id = req.body.knowledge_base_id ? req.body.knowledge_base_id : -1;
    let system_locale_id = req.body.system_locale_id ? req.body.system_locale_id : -1;
    let primary_ = req.body.primary_ ? req.body.primary_: false;

    if(knowledge_base_id == -1){
        return res.json({ status: "error", message: "Please specify the knowledge_base_id" });
    }

    let data = {
        knowledge_base_id: knowledge_base_id,
        system_locale_id: system_locale_id,
        primary_: primary_
    };

    pgQueries.createKnowledgeBaseLocales(res, data, returnResult);
});

router.put("/updateKnowledgeBaseLocales/:id", (req, res) => {
    let id = req.params.id;
    let knowledge_base_id = req.body.knowledge_base_id ? req.body.knowledge_base_id : -1;
    let system_locale_id = req.body.system_locale_id ? req.body.system_locale_id : -1;
    let primary_ = req.body.primary_ ? req.body.primary_: false;
    let updated_at = new Date().toUTCString();

    if(knowledge_base_id == -1){
        return res.json({ status: "error", message: "Please specify the knowledge_base_id" });
    }

    let data = {
        id: id,
        knowledge_base_id: knowledge_base_id,
        system_locale_id: system_locale_id,
        primary_: primary_,
        updated_at: updated_at
    };

    pgQueries.updateKnowledgeBaseLocales(data, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Knowledge base locales updated" });
    });
});

router.delete("/deleteKnowledgeBaseLocales/:id", (req, res) => {
    let id = req.params.id;

    let data = {
        id: id
    };

    pgQueries.deleteKnowledgeBaseLocales(data, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Knowledgebase Locale deleted successfully" });
    });
});


// calendars
router.get("/listCalendars", (req, res) => {
    pgQueries.listCalendars(res, returnResult);
});

router.post("/createCalendar", (req, res) => {
    let data = getCalendarData(req, res);

    pgQueries.createCalendar(res, data, returnResult);
});

router.put("/updateCalendar/:id", (req, res) => {
    let id = req.params.id;
    let data = getCalendarData(req, res);
    data.id = id;

    pgQueries.updateCalendar(data, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Calendar updated" });
    });
});

router.delete("/deleteCalendar/:id", (req, res) => {
    let id = req.params.id;

    let data = {
        id: id
    };

    pgQueries.deleteCalendar(data, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Calendar deleted successfully" });
    });
});

function getCalendarData(req, res){
    return {
        name: req.body.name ? req.body.name : "",
        timezone: req.body.timezone ? req.body.timezone : "",
        business_hours: req.body.business_hours ? req.body.business_hours: "",
        default_: req.body.default_ ? req.body.default_: false,
        ical_url: req.body.ical_url ? req.body.ical_url: "",
        public_holidays: req.body.public_holidays ? req.body.public_holidays: "",
        last_log: req.body.last_log ? req.body.last_log: "",
        last_sync: new Date().toUTCString(),
        updated_by_id: req.body.updated_by_id ? req.body.updated_by_id: -1,
        created_by_id: req.body.created_by_id ? req.body.created_by_id: -1
    };
}


// delayed_jobs
router.get("/listDelayedJobs", (req, res) => {
    pgQueries.listDelayedJobs(res, returnResult);
});

router.post("/createDelayedJob", (req, res) => {
    let priority = req.body.priority ? req.body.priority : 1;
    let attempts = req.body.attempts ? req.body.attempts : 0;
    let handler = req.body.handler ? req.body.handler: "default";
    let last_error = req.body.last_error ? req.body.last_error: "";
    let run_at = req.body.run_at ? req.body.run_at: new Date().toUTCString();
    let locked_at = req.body.locked_at ? req.body.locked_at: null;
    let failed_at = req.body.failed_at ? req.body.failed_at: null;
    let locked_by = req.body.locked_by ? req.body.locked_by: "";
    let queue = req.body.queue ? req.body.queue: "";

    let data = {
        priority: priority,
        attempts: attempts,
        handler: handler,
        last_error: last_error,
        run_at: run_at,
        locked_at: locked_at,
        failed_at: failed_at,
        locked_by: locked_by,
        queue: queue
    };

    pgQueries.createDelayedJob(res, data, returnResult);
});

router.put("/updateDelayedJob/:id", (req, res) => {
    let id = req.params.id;
    let priority = req.body.priority ? req.body.priority : 1;
    let attempts = req.body.attempts ? req.body.attempts : 0;
    let handler = req.body.handler ? req.body.handler: "default";
    let last_error = req.body.last_error ? req.body.last_error: "";
    let run_at = req.body.run_at ? req.body.run_at: new Date().toUTCString();
    let locked_at = req.body.locked_at ? req.body.locked_at: null;
    let failed_at = req.body.failed_at ? req.body.failed_at: null;
    let locked_by = req.body.locked_by ? req.body.locked_by: "";
    let queue = req.body.queue ? req.body.queue: "";
    let updated_at = new Date().toUTCString();

    let data = {
        id: id,
        priority: priority,
        attempts: attempts,
        handler: handler,
        last_error: last_error,
        run_at: run_at,
        locked_at: locked_at,
        failed_at: failed_at,
        locked_by: locked_by,
        queue: queue,
        updated_at: updated_at
    };

    pgQueries.updateDelayedJob(data, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Delayed job updated" });
    });
});

router.delete("/deleteDelayedJob/:id", (req, res) => {
    let id = req.params.id;

    let data = {
        id: id
    };

    pgQueries.deleteDelayedJob(data, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Delayed job deleted successfully" });
    });
});

// groups
router.get("/listGroups", (req, res) => {
    pgQueries.listGroups(res, returnResult);
});

router.post("/createGroup", (req, res) => {
    let data = getGroupData(req, res);
    let values = [
        req.body.name ? req.body.name: "name",
        true,
        "",
        "usr"
    ];
    pgQueries.createGroup(values, result => {
        if(result.err){
            result.err.errorIndex = 70028282922;
            return res.status(500).json(result.err);
        }
        res.json({ status: "success", message: "Group created" });
    });
});

router.put("/updateGroup/:id", (req, res) => {
    let id = req.params.id;
    let updated_at = new Date().toUTCString();

    let data = getGroupData(req, res);
    data.id = id;
    data.updated_at = updated_at;

    pgQueries.updateGroup(data, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Group updated" });
    });
});

router.delete("/deleteGroup/:id", (req, res) => {
    let id = req.params.id;

    let data = {
        id: id
    };

    pgQueries.deleteGroup(data, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Group deleted successfully" });
    });
});

function getGroupData(req, res){
    return {
        signature_id: req.body.signature_id ? req.body.signature_id : 1,
        email_address_id: req.body.email_address_id ? req.body.email_address_id : 1,
        name: req.body.name ? req.body.name: "name",
        assignment_timeout: req.body.assignment_timeout ? req.body.assignment_timeout: 0,
        follow_up_possible: req.body.follow_up_possible ? req.body.follow_up_possible: "",
        follow_up_assignment: req.body.follow_up_assignment ? req.body.follow_up_assignment: false,
        active: req.body.active ? req.body.active: true,
        note: req.body.note ? req.body.note: "",
        updated_by_id: req.body.updated_by_id ? req.body.updated_by_id: 1,
        created_by_id: req.body.created_by_id ? req.body.created_by_id: 1
    };
}


// permissions_groups
router.get("/listPermissionsGroups", (req, res) => {
    pgQueries.listPermissionsGroups(res, returnResult);
});

router.post("/createPermissionsGroup", (req, res) => {
    let group_id = req.body.group_id ? req.body.group_id : 1;
    let permission_id = req.body.permission_id ? req.body.permission_id : 1;

    let data = {
        group_id: group_id,
        permission_id: permission_id
    };

    pgQueries.createPermissionsGroup(res, data, returnResult);
});

router.put("/updatePermissionsGroup/:id", (req, res) => {
    let id = req.params.id;
    let group_id = req.body.group_id ? req.body.group_id : 1;
    let permission_id = req.body.permission_id ? req.body.permission_id : 1;

    let data = {
        id: id,
        group_id: group_id,
        permission_id: permission_id
    };

    pgQueries.updatePermissionsGroup(data, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Permission group updated" });
    });
});

router.delete("/deletePermissionsGroup/:id", (req, res) => {
    let id = req.params.id;

    let data = {
        id: id
    };

    pgQueries.deletePermissionsGroup(data, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Permission group deleted successfully" });
    });
});

// permissions
router.get("/listPermissions", (req, res) => {
    pgQueries.listPermissions(res, returnResult);
});

router.post("/createPermission", (req, res) => {
    let name = req.body.name ? req.body.name : "";
    let note = req.body.note ? req.body.note : "";
    let preferences = req.body.preferences ? req.body.preferences : "";
    let active = req.body.active ? req.body.active : true;
    let allow_signup = req.body.allow_signup ? req.body.allow_signup : false;

    let data = {
        name: name,
        note: note,
        preferences: preferences,
        active: active,
        allow_signup: allow_signup
    };

    pgQueries.createPermission(res, data, returnResult);
});

router.put("/updatePermission/:id", (req, res) => {
    let id = req.params.id;
    let name = req.body.name ? req.body.name : "";
    let note = req.body.note ? req.body.note : "";
    let preferences = req.body.preferences ? req.body.preferences : "";
    let active = req.body.active ? req.body.active : true;
    let allow_signup = req.body.allow_signup ? req.body.allow_signup : false;
    let updated_at = new Date().toUTCString();

    let data = {
        id: id,
        name: name,
        note: note,
        preferences: preferences,
        active: active,
        allow_signup: allow_signup,
        updated_at: updated_at
    };

    pgQueries.updatePermission(data, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Permission updated" });
    });
});

router.delete("/deletePermission/:id", (req, res) => {
    let id = req.params.id;

    let data = {
        id: id
    };

    pgQueries.deletePermission(data, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Permission deleted successfully" });
    });
});

router.get("/filter/knowledge_base_id/:knowledge_base_id/locale_id/:locale_id/filterBy/:filterBy/status/:status", (req, res) => {
    let knowledge_base_id = req.params.knowledge_base_id;
    let locale_id = req.params.locale_id;
    let filterBy = req.params.filterBy; // article | category
    let status = req.params.status;

    if(!["article","category"].find(filterWith => filterWith == filterBy)) return res.json({status:"error", message: "Please enter either 'article' or 'category' for filterBy"});
    
    if(filterBy == "article"){
        executeFilterByArticle(req, res, knowledge_base_id, locale_id, status);
    }else{
        executeFilterByCategory(req, res, knowledge_base_id, locale_id, status);
    }
});

module.exports = router;
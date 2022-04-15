const pgQueries = require('../../postgres/kb-queries');
const fs = require('fs');

const getData = async ({knowledge_base_id}) => {
    return new Promise((resolve, reject) => {
        let kb_id = knowledge_base_id;
        let data = "";

        //get the knowledge_bases
        exportKnowledgeBaseData(data, kb_id, result => {
            exportKnowledgeBaseTranslations(result, kb_id, result => {
                exportKnowledgeBaseCategories(result, kb_id, result => {
                    exportKnowledgeBaseCategoryTranslations(result, kb_id, result => {
                        exportKnowledgeBaseCategoryDelayedJobs(result, kb_id, result => {
                            exportKnowledgeBaseArticles(result, kb_id, result => {
                                exportKnowledgeBaseArticleTranslations(result, kb_id, result => {
                                    exportKnowledgeBaseArticleDelayedJobs(result, kb_id, result => {
                                        exportKnowledgeBaseLists(result, kb_id, result => {
                                            let filename = "export.csv";
                                            fs.writeFile(`${__dirname}/../../public/export/${filename}`, result, err => {
                                                if (err) {
                                                    return reject(err);
                                                }
                                                resolve({ status: "success", message: "File exported!", link: `http://${process.env.HOST}:${process.env.PORT}/export/${filename}`});
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}



function exportKnowledgeBaseData(data, kb_id, cb){
    pgQueries.listKnowledgeBasesById([kb_id], result => {
        if(result.err){
            console.error(result.err);
            return cb(data);
        }

        let knowledgebases = result.res;
        data += "[knowledge_bases]\n";
        data += "id,name,icon,footer,created_at,homepage_layout,category_layout,active,updated_at,front_page,position,ui_color,is_archived\n";
        knowledgebases.forEach(kb => {
            data+= `${kb.id},${kb.name},${kb.icon},${kb.footer},${kb.created_at},${kb.homepage_layout},${kb.category_layout},${kb.active},${kb.updated_at},${kb.front_page},${kb.position},${kb.ui_color},${kb.is_archived}\n`;
        });
        data += "\n";
        cb(data);
    });
}

function exportKnowledgeBaseTranslations(data, kb_id, cb){
    pgQueries.getKnowledgeBaseTranslationsById(kb_id, result => {
        if(result.err){
            console.error(result.err);
            return cb(data);
        }

        let kb_translations = result.res;
        data += "[knowledge_base_translations]\n";
        data += "id,knowledge_base_id,title,created_at,updated_at,footer_note,kb_locale_id,active,position,ui_color,is_archived\n";
        kb_translations.forEach(kb => {
            data+= `${kb.id},${kb.knowledge_base_id},${kb.title},${kb.created_at},${kb.updated_at},${kb.footer_note},${kb.kb_locale_id},${kb.active},${kb.position},${kb.ui_color},${kb.is_archived}\n`;
        });
        data += "\n";
        cb(data);
    });
}

function exportKnowledgeBaseCategories(data, kb_id, cb){
    pgQueries.listKnowledgeBaseCategoriesByKnowledgeBaseId(kb_id, result => {
        if(result.err){
            console.error(result.err);
            return cb(data);
        }

        let kb_categories = result.res;
        data += "[knowledge_base_categories]\n";
        data += "id,knowledge_base_id,parent_id,position,created_at,updated_at,is_archived\n";
        kb_categories.forEach(kb => {
            data+= `${kb.id},${kb.knowledge_base_id},${kb.parent_id},${kb.position},${kb.created_at},${kb.updated_at},${kb.is_archived}\n`;
        });
        data += "\n";
        cb(data);
    });
}

function exportKnowledgeBaseCategoryTranslations(data, kb_id, cb){
    pgQueries.listKnowledgeBaseCategoriesByKnowledgeBaseId(kb_id, result => {
        if(result.err){
            console.error(result.err);
            return cb(data);
        }

        let kb_categories = result.res;
        let numCategories = kb_categories.length;
        let count = -1;

        let kb_cat_translations = [];

        kb_categories.forEach(cat => {
            pgQueries.getKnowledgeBaseCategoryTranslationsByCategoryId(null, cat.id, (res_, result) => {
                if(result.err){
                    result.err.errorIndex = 84239029229292;
                    return checkComplete();
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
                data += "id,name,kb_locale_id,category_id,created_at,updated_at,ui_color,category_icon,title_tag,footer,keywords,meta_description,publish_now,active,permission,update_metadata,is_delete_scheduled,is_update_scheduled,knowledge_base_id,is_archived,list_id\n";
                kb_cat_translations.forEach(kb => {
                    data+= `${kb.id},${kb.name},${kb.kb_locale_id},${kb.category_id},${kb.created_at},${kb.updated_at},${kb.ui_color},${kb.category_icon},${kb.title_tag},${kb.footer},${kb.keywords},${kb.meta_description},${kb.publish_now},${kb.active},${kb.permission},${kb.update_metadata},${kb.is_delete_scheduled},${kb.is_update_scheduled},${kb.knowledge_base_id},${kb.is_archived},${kb.list_id}\n`;
                });
                data += "\n";
                cb(data);
            }
        }
    });
}

function exportKnowledgeBaseCategoryDelayedJobs(data, kb_id, cb){
    pgQueries.getKnowledgeBaseCategoryDelayedJobByKnowledgeBaseId(kb_id, result => {
        if(result.err){
            console.error(result.err);
            return cb(data);
        }
        
        let kb_delayed_jobs = result.res;
        data += "[knowledge_base_category_delayed_jobs]\n";
        data += "id,knowledge_base_category_translation_id,run_at,created_at,knowledge_base_id,publish_update_delete\n";
        kb_delayed_jobs.forEach(kb => {
            data += `${kb.id},${kb.knowledge_base_category_translation_id},${kb.run_at},${kb.created_at},${kb.knowledge_base_id},${kb.publish_update_delete}\n`;
        });
        data += "\n";
        cb(data);
    });
}

function exportKnowledgeBaseArticles(data, kb_id, cb){
    pgQueries.getKnowledgeBaseArticlesByKnowledgeBaseId(kb_id, result => {
        if(result.err){
            console.error(result.err);
            return cb(data);
        }

        let kb_articles = result.res;
        data += "[knowledge_base_articles]\n";
        data += "id,category_id,position,updated_at,created_at,knowledge_base_id,is_archived\n";
        kb_articles.forEach(kb => {
            data+= `${kb.id},${kb.category_id},${kb.position},${kb.updated_at},${kb.created_at},${kb.knowledge_base_id},${kb.is_archived}\n`;
        });
        data += "\n";
        cb(data);
    });
}

function exportKnowledgeBaseArticleTranslations(data, kb_id, cb){
    pgQueries.getKnowledgeBaseArticlesByKnowledgeBaseId(kb_id, result => {
        if(result.err){
            console.error(result.err);
            return cb(data);
        }

        let kb_articles = result.res;
        let numArticles = kb_articles.length;
        let count = -1;

        let kb_art_translations = [];

        kb_articles.forEach(art => {
            pgQueries.getKnowledgeBaseArticleTranslationByArticleId(art.id, result => {
                if(result.err){
                    console.error(result.err);
                    return cb(data);
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
                data += "id,title,kb_locale_id,created_at,updated_at,body,keywords,title_tag,meta_description,article_id,active,publish_now,update_metadata,is_delete_scheduled,is_update_scheduled,knowledge_base_id,is_archived,category_id,ui_color,list_name,position,list_id\n";
                kb_art_translations.forEach(kb => {
                    data+= `${kb.id},${kb.title},${kb.kb_locale_id},${kb.created_at},${kb.updated_at},${kb.body},${kb.keywords},${kb.title_tag},${kb.meta_description},${kb.article_id},${kb.active},${kb.publish_now},${kb.update_metadata},${kb.is_delete_scheduled},${kb.is_update_scheduled},${kb.knowledge_base_id},${kb.is_archived},${kb.category_id},${kb.ui_color},${kb.list_name},${kb.position},${kb.list_id}\n`;
                });
                data += "\n";
                cb(data);
            }
        }
    });
}


function exportKnowledgeBaseArticleDelayedJobs(data, kb_id, cb){
    pgQueries.getKnowledgeBaseArticleDelayedJobByKnowledgeBaseId(kb_id, result => {
        if(result.err){
            console.error(result.err);
            return cb(data);
        }
        
        let kb_delayed_jobs = result.res;
        data += "[knowledge_base_article_delayed_jobs]\n";
        data += "id,knowledge_base_id,knowledge_base_article_id,knowledge_base_article_translation_id,run_at,created_at,publish_update_delete\n";
        kb_delayed_jobs.forEach(kb => {
            data += `${kb.id},${kb.knowledge_base_id},${kb.knowledge_base_article_id},${kb.knowledge_base_article_translation_id},${kb.run_at},${kb.created_at},${kb.publish_update_delete}\n`;
        });
        data += "\n";
        cb(data);
    });
}

function exportKnowledgeBaseLists(data, kb_id, cb){
    pgQueries.getKnowledgeBaseListsByKnowledgeBaseId(kb_id, result => {
        if(result.err){
            console.error(result.err);
            return cb(data);
        }

        let kb_lists = result.res;
        let numLists = kb_lists.length;
        let count = -1;

        let kb_list_types = [];

        kb_lists.forEach(art => {
            pgQueries.getKnowledgeBaseListById(art.id, result => {
                if(result.err){
                    console.error(result.err);
                    return cb(data);
                }

                result.res.forEach(translation => {
                    kb_list_types.push(translation);
                });
                checkComplete();
            });
        });

        checkComplete();

        function checkComplete(){
            count++;
            if(count == numLists){
                data += "[knowledge_base_lists]\n";
                data += "id,knowledge_base_id,list_type,title,position,created_at\n";
                kb_list_types.forEach(kb => {
                    data+= `${kb.id},${kb.knowledge_base_id},${kb.list_type},${kb.title},${kb.position},${kb.created_at}\n`;
                });
                data += "\n";
                cb(data);
            }
        }
    });
}


module.exports = async (parents, args) => {
    return await getData(args);
}
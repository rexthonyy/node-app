const { Pool, Client } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
});

pool.query('SELECT NOW()', (err, res) => {
    if(err){
        console.log("knowledgebase databse initialization failed!!!");
    }else{
        console.log("knowledgebase databse initialized successfully....!!!");
    }
});

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
});
client.connect();

const updatePositionForKnowledgeBase = (values, response) => {
    client.query('UPDATE knowledge_bases SET position=$2 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 231311212
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const listKnowledgeBasesById = (values, response) => {
    pool.query("SELECT * from knowledge_bases WHERE id=$1", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 3829821
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const listKnowledgeBases = (response) => {
    pool.query("SELECT * from knowledge_bases", (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 232421
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createKnowledgeBase = (data, response) => {
    const values = [data.name, data.icon, data.footer, data.homepage_layout, data.category_layout, data.active, data.front_page];
    client.query('INSERT INTO knowledge_bases(name, icon, footer, homepage_layout, category_layout, active, front_page) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 3282
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateKnowledgeBase = (data, response) => {
    const values = [data.id, data.name, data.icon, data.footer, data.homepage_layout, data.category_layout, data.active, data.updated_at, data.front_page];
    client.query('UPDATE knowledge_bases SET name=$2, icon=$3, footer=$4, homepage_layout=$5, category_layout=$6, active=$7, updated_at=$8, front_page=$9 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 7482
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteKnowledgeBase = (data, response) => {
    const values = [data.id];
    client.query('DELETE FROM knowledge_bases WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 1111111
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};


const getKnowledgeBaseTranslationsById = (id, response) => {
    pool.query(`SELECT * from knowledge_base_translations WHERE knowledge_base_id=${id}`, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 32
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getKnowledgeBaseTranslationsByKnowledgeBaseId = (knowledge_base_id, response) => {
    pool.query(`SELECT * from knowledge_base_translations WHERE knowledge_base_id=${knowledge_base_id}`, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 323
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const listKnowledgeBaseTranslations = (res_, response) => {
    pool.query("SELECT * from knowledge_base_translations", (err, res) => {
        if(err){
            response(res_, {
                err: err,
                res: null
            });
        }else{
            response(res_, {
                err: null,
                res: res.rows
            });
        }
        console.log("");
    });
};

const createKnowledgeBaseTranslation = (data, response) => {
    const values = [data.title, data.footer_note, data.kb_locale_id, data.knowledge_base_id, data.active, data.position, data.ui_color];
    client.query('INSERT INTO knowledge_base_translations(title, footer_note, kb_locale_id, knowledge_base_id, active, position, ui_color) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 230
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateKnowledgeBaseTranslation = (data, response) => {
    const values = [data.id, data.title, data.footer_note, data.kb_locale_id, data.updated_at, data.active];
    client.query('UPDATE knowledge_base_translations SET title=$2, footer_note=$3, kb_locale_id=$4, updated_at=$5, active=$6 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 221
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteKnowledgeBaseTranslation = (data, response) => {
    const values = [data.id];
    client.query('DELETE FROM knowledge_base_translations WHERE id=$1', values, (err, res) => {
        if (err) {
            console.log("");
            response({
                err: err.stack,
                res: null
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteKnowledgeBaseTranslationByKnowledgeBaseId = (kb_id, response) => {
    const values = [kb_id];
    client.query('DELETE FROM knowledge_base_translations WHERE knowledge_base_id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: null
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const listKnowledgeBaseCategoriesById = (id, response) => {
    pool.query(`SELECT * from knowledge_base_categories WHERE id=${id}`, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 22
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getKnowledgeBaseCategoryTranslationsByKnowledgeBaseIdAndCategoryId = (values, response) => {
    pool.query("SELECT * from knowledge_base_category_translations WHERE knowledge_base_id=$1 AND category_id=$2", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 22
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getKnowledgeBaseArticleTranslationsByKnowledgeBaseIdAndCategoryId = (values, response) => {
    pool.query("SELECT * from knowledge_base_article_translations WHERE knowledge_base_id=$1 AND category_id=$2", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 22
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getKnowledgeBaseCategoriesByKnowledgeBaseIdAndCategoryId = (values, response) => {
    pool.query("SELECT * from knowledge_base_categories WHERE knowledge_base_id=$1 AND id=$2", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 22
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const listKnowledgeBaseCategoriesByKnowledgeBaseId = (id, response) => {
    pool.query(`SELECT * from knowledge_base_categories WHERE knowledge_base_id=${id}`, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 223
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getKnowledgeBaseCategoriesByKnowledgeBaseIdAndParentId = (kb_id, parent_id, response) => {
    pool.query(`SELECT * from knowledge_base_categories WHERE knowledge_base_id=${kb_id} AND parent_id=${parent_id}`, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 25623
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getKnowledgeBaseCategoriesByParentId = (parent_id, response) => {
    pool.query(`SELECT * from knowledge_base_categories WHERE parent_id=${parent_id}`, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 25623
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getKnowledgeBaseCategoryTranslationsByCategoryIdAndLocaleId = (category_id, locale_id, response) => {
    pool.query(`SELECT * from knowledge_base_category_translations WHERE category_id=${category_id} AND kb_locale_id=${locale_id}`, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 200
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const listKnowledgeBaseCategories = (res_, response) => {
    pool.query("SELECT * from knowledge_base_categories", (err, res) => {
        if(err){
            response(res_, {
                err: err,
                res: null
            });
            console.log("");
        }else{
            response(res_, {
                err: null,
                res: res.rows
            });
        }
    });
};

const createKnowledgeBaseCategory = (values, response) => {
    client.query('INSERT INTO knowledge_base_categories(knowledge_base_id, parent_id, position, created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 184
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateKnowledgeBaseCategory = (values, response) => {
    client.query('UPDATE knowledge_base_categories SET knowledge_base_id=$1, parent_id=$2, position=$3, created_at=$4, updated_at=$5 WHERE id=$6', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 23
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateKnowledgeBaseCategoryParentIdById = (category_id, parent_id, response) => {
    client.query('UPDATE knowledge_base_categories SET parent_id=$2 WHERE id=$1', [category_id, parent_id], (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 231111
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updatePositionForKnowledgeBaseCategory = (values, response) => {
    client.query('UPDATE knowledge_base_categories SET position=$2 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 2313111
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteKnowledgeBaseCategory = (data, response) => {
    const values = [data.id];
    client.query('DELETE FROM knowledge_base_categories WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 2
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const getKnowledgeBaseCategoryTranslationsByCategoryId = (res_, category_id, response) => {
    pool.query(`SELECT * from knowledge_base_category_translations WHERE category_id=${category_id}`, (err, res) => {
        if(err){
            response(res_, {
                err: err,
                res: null,
                tes: 1
            });
        }else{
            response(res_, {
                err: null,
                res: res.rows
            });
        }
    });
};

const getKnowledgeBaseCategoryTranslationByLocaleId = (kb_locale_id, response) => {
    pool.query(`SELECT * from knowledge_base_category_translations WHERE kb_locale_id=${kb_locale_id}`, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 38574330
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getKnowledgeBaseCategoryTranslationByCategoryIdAndLocaleId = (category_id, kb_locale_id, response) => {
    pool.query(`SELECT * from knowledge_base_category_translations WHERE category_id=${category_id} AND kb_locale_id=${kb_locale_id}`, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 1304
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getKnowledgeBaseCategoryTranslations = (res_, response) => {
    pool.query("SELECT * from knowledge_base_category_translations", (err, res) => {
        if(err){
            response(res_, {
                err: err,
                res: null,
                tes: 32
            });
        }else{
            response(res_, {
                err: null,
                res: res.rows
            });
        }
    });
};

const createKnowledgeBaseCategoryTranslation = (values, response) => {
    client.query('INSERT INTO knowledge_base_category_translations (name, kb_locale_id, category_id, created_at, updated_at, ui_color, category_icon, title_tag, footer, keywords, meta_description, publish_now, active, permission, list_id, is_delete_scheduled, is_update_scheduled, knowledge_base_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 49
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateKnowledgeBaseCategoryTranslation = (category_id, kb_locale_id, values, response) => {
    client.query(`UPDATE knowledge_base_category_translations SET name=$1, kb_locale_id=$2, category_id=$3, created_at=$4, updated_at=$5, ui_color=$6, category_icon=$7, title_tag=$8, footer=$9, keywords=$10, meta_description=$11, publish_now=$12, active=$13, permission=$14, list_id=$15, knowledge_base_id=$16 WHERE category_id=${category_id} AND kb_locale_id=${kb_locale_id} RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 23943
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateKnowledgeBaseCategoryTranslationsUIColor = (values, response) => {
    client.query(`UPDATE knowledge_base_category_translations SET ui_color=$2 WHERE id=$1 RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 23943
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteKnowledgeBaseCategoryTranslationsByCategoryId = (category_id, response) => {
    client.query(`DELETE FROM knowledge_base_category_translations WHERE category_id=${category_id}`, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 2323
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteKnowledgeBaseCategoryTranslationById = (translation_id, response) => {
    client.query(`DELETE FROM knowledge_base_category_translations WHERE id=${translation_id}`, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 232332
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};







const getKnowledgeBaseArticlesById = (article_id, response) => {
    pool.query(`SELECT * from knowledge_base_articles WHERE id=${article_id}`, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 12321
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getKnowledgeBaseArticlesByKnowledgeBaseId = (article_id, response) => {
    pool.query(`SELECT * from knowledge_base_articles WHERE knowledge_base_id=${article_id}`, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 12321
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getKnowledgeBaseArticlesByKnowledgeBaseIdAndCategoryId = (values, response) => {
    pool.query("SELECT * from knowledge_base_articles WHERE knowledge_base_id=$1 AND category_id=$2", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 1
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getKnowledgeBaseArticlesByKnowledgeBaseCategoryId = (knowledge_base_category_id, response) => {
    pool.query(`SELECT * from knowledge_base_articles WHERE category_id=${knowledge_base_category_id}`, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 1
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const listKnowledgeBaseArticles = (res_, response) => {
    pool.query("SELECT * from knowledge_base_articles", (err, res) => {
        if(err){
            response(res_, {
                err: err,
                res: null,
                tes: 3844
            });
        }else{
            response(res_, {
                err: null,
                res: res.rows
            });
        }
    });
};

const updatePositionForKnowledgeBaseTranslation = (values, response) => {
    client.query('UPDATE knowledge_base_translations SET position=$2 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 231310121
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updatePositionForKnowledgeBaseArticle = (values, response) => {
    client.query('UPDATE knowledge_base_articles SET position=$2 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 23131121
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};



const createKnowledgeBaseArticle = (data, response) => {
    const values = [data.category_id, data.position, data.updated_at, data.created_at, data.knowledge_base_id];
    client.query('INSERT INTO knowledge_base_articles(category_id, position, updated_at, created_at, knowledge_base_id) VALUES($1, $2, $3, $4, $5) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 3282
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateKnowledgeBaseArticle = (article_id, data, response) => {
    const values = [article_id, data.category_id, data.position, data.updated_at, data.created_at, data.knowledge_base_id];

    client.query('UPDATE knowledge_base_articles SET category_id=$2, position=$3, updated_at=$4, created_at=$5, knowledge_base_id=$6 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 111
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteKnowledgeBaseArticle = (data, response) => {
    const values = [data.id];
    client.query('DELETE FROM knowledge_base_articles WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 27118
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteKnowledgeBaseArticleTranslationByArticleId = (article_id, response) => {
    const values = [article_id];
    client.query('DELETE FROM knowledge_base_article_translations WHERE article_id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 2711821
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
}



const getKnowledgeBaseArticleTranslationByArticleId = (article_id, response) => {
    pool.query(`SELECT * from knowledge_base_article_translations WHERE article_id=${article_id}`, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 122
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getKnowledgeBaseArticleTranslationByArticleIdAndLocaleId = (article_id, kb_locale_id, response) => {
    pool.query(`SELECT * from knowledge_base_article_translations WHERE article_id=${article_id} AND kb_locale_id=${kb_locale_id}`, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 122
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};


const getKnowledgeBaseArticleTranslationsByCategoryId = (category_id, response) => {
    pool.query(`SELECT * from knowledge_base_article_translations WHERE category_id=${category_id}`, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 122
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getKnowledgeBaseArticleTranslationsByKnowledgeBaseIdCategoryIdAndLocaleId = (values, response) => {
    pool.query("SELECT * from knowledge_base_article_translations WHERE knowledge_base_id=$1 AND category_id=$2 AND kb_locale_id=$3", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 122
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getKnowledgeBaseArticleTranslationsByCategoryIdAndLocaleId = (category_id, locale_id, response) => {
    pool.query(`SELECT * from knowledge_base_article_translations WHERE category_id=${category_id} AND kb_locale_id=${locale_id}`, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 122
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getKnowledgeBaseArticleTranslationByKnowledgeBaseIdAndLocaleId = (values, response) => {
    pool.query(`SELECT * from knowledge_base_article_translations WHERE knowledge_base_id=$1 AND kb_locale_id=$2`, values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 122
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getKnowledgeBaseCategoryTranslationsByKnowledgeBaseIdCategoryIdAndLocaleId = (values, response) => {
    pool.query(`SELECT * from knowledge_base_category_translations WHERE knowledge_base_id=$1 AND category_id=$2 AND kb_locale_id=$3`, values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 122
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getKnowledgeBaseCategoryTranslationsByKnowledgeBaseIdAndLocaleId = (values, response) => {
    pool.query(`SELECT * from knowledge_base_category_translations WHERE knowledge_base_id=$1 AND kb_locale_id=$2`, values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 122
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const listKnowledgeBaseArticleTranslations = (res_, response) => {
    pool.query("SELECT * from knowledge_base_article_translations", (err, res) => {
        if(err){
            response(res_, {
                err: err,
                res: null,
                tes: 67
            });
        }else{
            response(res_, {
                err: null,
                res: res.rows
            });
        }
    });
};

const createKnowledgeBaseArticleTranslation = (data, response) => {
    const values = [data.title, data.kb_locale_id, data.created_at, data.updated_at, data.body, data.keywords, data.title_tag, data.meta_description, data.article_id, data.active, data.publish_now, data.is_delete_scheduled, data.is_update_scheduled, data.category_id, data.ui_color, data.list_name, data.knowledge_base_id];
    client.query('INSERT INTO knowledge_base_article_translations(title, kb_locale_id, created_at, updated_at, body, keywords, title_tag, meta_description, article_id, active, publish_now, is_delete_scheduled, is_update_scheduled, category_id, ui_color, list_name, knowledge_base_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 384
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateKnowledgeBaseArticleTranslation = (article_id, kb_locale_id, data, response) => {
    const values = [data.title, data.kb_locale_id, data.created_at, data.updated_at, data.body, data.keywords, data.title_tag, data.meta_description, data.article_id, data.active, data.publish_now, data.category_id, data.ui_color, data.list_name, data.knowledge_base_id];
    client.query(`UPDATE knowledge_base_article_translations SET title=$1, kb_locale_id=$2, created_at=$3, updated_at=$4, body=$5, keywords=$6, title_tag=$7, meta_description=$8, article_id=$9, active=$10, publish_now=$11, category_id=$12, ui_color=$13, list_name=$14, knowledge_base_id=$15 WHERE article_id=${article_id} AND kb_locale_id=${kb_locale_id} RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 82911
            });
        } else {
            console.log(res);
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateKnowledgeBaseArticleTranslationsUIColor = (values, response) => {
    client.query(`UPDATE knowledge_base_article_translations SET ui_color=$2 WHERE id=$1 RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 82911
            });
        } else {
            console.log(res);
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteKnowledgeBaseArticleTranslation = (data, response) => {
    const values = [data.id];
    client.query('DELETE FROM knowledge_base_article_translations WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 372836
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};


const getLocaleById = (id, response) => {
    pool.query(`SELECT * from locales WHERE id=${id}`, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 22
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const listLocales = response => {
    pool.query("SELECT * from locales", (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 23
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createLocale = (res_, data, response) => {
    const values = [data.locale, data.alias, data.name, data.dir, data.active];
    client.query('INSERT INTO locales(locale, alias, name, dir, active) VALUES($1, $2, $3, $4, $5) RETURNING *', values, (err, res) => {
        if (err) {
            response(res_, {
                err: err.stack,
                res: null,
                tes: 32
            });
        } else {
            response(res_, {
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateLocale = (data, response) => {
    const values = [data.id, data.locale, data.alias, data.name, data.dir, data.active, data.updated_at];
    client.query('UPDATE locales SET locale=$2, alias=$3, name=$4, dir=$5, active=$6, updated_at=$7 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 900
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteLocale = (data, response) => {
    const values = [data.id];
    client.query('DELETE FROM locales WHERE id=$1', values, (err, res) => {
        if (err) {
            console.log("");console.log("");console.log("");console.log("");
            response({
                err: err.stack,
                res: null
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};


const listKnowledgeBaseLocales = (res_, response) => {
    pool.query("SELECT * from knowledge_base_locales", (err, res) => {
        if(err){
            response(res_, {
                err: err,
                res: null,
                tes: 91
            });
        }else{
            response(res_, {
                err: null,
                res: res.rows
            });
        }
    });
};

const createKnowledgeBaseLocales = (res_, data, response) => {
    const values = [data.knowledge_base_id, data.system_locale_id, data.primary_];
    client.query('INSERT INTO knowledge_base_locales(knowledge_base_id, system_locale_id, primary_) VALUES($1, $2, $3) RETURNING *', values, (err, res) => {
        if (err) {
            response(res_, {
                err: err.stack,
                res: null,
                tes: 90
            });
        } else {
            response(res_, {
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateKnowledgeBaseLocales = (data, response) => {
    const values = [data.id, data.knowledge_base_id, data.system_locale_id, data.primary_, data.updated_at];
    client.query('UPDATE knowledge_base_locales SET knowledge_base_id=$2, system_locale_id=$3, primary_=$4, updated_at=$5 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null
            });
            console.log("");console.log("");console.log("");console.log("");console.log("");
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteKnowledgeBaseLocales = (data, response) => {
    const values = [data.id];
    client.query('DELETE FROM knowledge_base_locales WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null
            });
            console.log("");console.log("");console.log("");console.log("");console.log("");console.log("");
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};


const listCalendars = (res_, response) => {
    pool.query("SELECT * from calendars", (err, res) => {
        if(err){
            response(res_, {
                err: err,
                res: null,
                slug: null
            });
        }else{
            response(res_, {
                err: null,
                res: res.rows
            });
        }
    });
};

const createCalendar = (res_, data, response) => {
    const values = [data.name, data.timezone, data.business_hours, data.default_, data.ical_url, data.public_holidays, data.last_log, data.last_sync, data.updated_by_id, data.created_by_id];
    client.query('INSERT INTO calendars (name, timezone, business_hours, default_, ical_url, public_holidays, last_log, last_sync, updated_by_id, created_by_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *', values, (err, res) => {
        if (err) {
            response(res_, {
                err: err.stack,
                res: null,
                slug: null
            });
        } else {
            response(res_, {
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateCalendar = (data, response) => {
    const values = [data.id, data.name, data.timezone, data.business_hours, data.default_, data.ical_url, data.public_holidays, data.last_log, data.last_sync, data.updated_by_id, data.created_by_id, data.updated_at];
    client.query('UPDATE calendars SET name=$2, timezone=$3, business_hours=$4, default_=$5, ical_url=$6, public_holidays=$7, last_log=$8, last_sync=$9, updated_by_id=$10, created_by_id=$11, updated_at=$12 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 231
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteCalendar = (data, response) => {
    const values = [data.id];
    client.query('DELETE FROM calendars WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                slug: null
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};


const listDelayedJobs = (res_, response) => {
    pool.query("SELECT * from delayed_jobs", (err, res) => {
        if(err){
            response(res_, {
                err: err,
                res: null,
                slug: 21
            });
        }else{
            response(res_, {
                err: null,
                res: res.rows
            });
        }
    });
};

const createDelayedJob = (res_, data, response) => {
    const values = [data.priority, data.attempts, data.handler, data.last_error, data.run_at, data.locked_at, data.failed_at, data.locked_by, data.queue];
    client.query('INSERT INTO delayed_jobs (priority, attempts, handler, last_error, run_at, locked_at, failed_at, locked_by, queue) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', values, (err, res) => {
        if (err) {
            response(res_, {
                err: err.stack,
                res: null,
                test: 234
            });
        } else {
            response(res_, {
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateDelayedJob = (data, response) => {
    const values = [data.id, data.priority, data.attempts, data.handler, data.last_error, data.run_at, data.locked_at, data.failed_at, data.locked_by, data.queue, data.updated_at];
    client.query('UPDATE delayed_jobs SET priority=$2, attempts=$3, handler=$4, last_error=$5, run_at=$6, locked_at=$7, failed_at=$8, locked_by=$9, queue=$10, updated_at=$11 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 234
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteDelayedJob = (data, response) => {
    const values = [data.id];
    client.query('DELETE FROM delayed_jobs WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 1
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};


const listGroups = (res_, response) => {
    pool.query("SELECT * from groups", (err, res) => {
        if(err){
            response(res_, {
                err: err,
                res: null,
                test: 2
            });
        }else{
            response(res_, {
                err: null,
                res: res.rows
            });
        }
    });
};

const createGroup = (values, response) => {
    client.query('INSERT INTO groups(name, active, note, type) VALUES($1, $2, $3, $4) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 3282932
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateGroup = (data, response) => {
    const values = [data.id, data.signature_id, data.email_address_id, data.name, data.assignment_timeout, data.follow_up_possible, data.follow_up_assignment, data.active, data.note, data.updated_by_id, data.created_by_id, data.updated_at];
    client.query('UPDATE groups SET signature_id=$2, email_address_id=$3, name=$4, assignment_timeout=$5, follow_up_possible=$6, follow_up_assignment=$7, active=$8, note=$9, updated_by_id=$10, created_by_id=$11, updated_at=$12 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 4
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteGroup = (data, response) => {
    const values = [data.id];
    client.query('DELETE FROM groups WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 5
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};



const listPermissionsGroups = (res_, response) => {
    pool.query("SELECT * from permissions_groups", (err, res) => {
        if(err){
            response(res_, {
                err: err,
                res: null,
                test: 6
            });
        }else{
            response(res_, {
                err: null,
                res: res.rows
            });
        }
    });
};

const createPermissionsGroup = (res_, data, response) => {
    const values = [data.group_id, data.permission_id];
    client.query('INSERT INTO permissions_groups (group_id, permission_id) VALUES($1, $2) RETURNING *', values, (err, res) => {
        if (err) {
            response(res_, {
                err: err.stack,
                res: null,
                test: 7
            });
        } else {
            response(res_, {
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updatePermissionsGroup = (data, response) => {
    const values = [data.id, data.group_id, data.permission_id];
    client.query('UPDATE permissions_groups SET group_id=$2, permission_id=$3 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deletePermissionsGroup = (data, response) => {
    const values = [data.id];
    client.query('DELETE FROM permissions_groups WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 9
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};



const listPermissions = (res_, response) => {
    pool.query("SELECT * from permissions", (err, res) => {
        if(err){
            response(res_, {
                err: err,
                res: null,
                test: 10
            });
        }else{
            response(res_, {
                err: null,
                res: res.rows
            });
        }
    });
};

const createPermission = (res_, data, response) => {
    const values = [data.name, data.note, data.preferences, data.active, data.allow_signup];
    client.query('INSERT INTO permissions (name, note, preferences, active, allow_signup) VALUES($1, $2, $3, $4, $5) RETURNING *', values, (err, res) => {
        if (err) {
            response(res_, {
                err: err.stack,
                res: null,
                test: 11
            });
        } else {
            response(res_, {
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updatePermission = (data, response) => {
    const values = [data.id, data.name, data.note, data.preferences, data.active, data.allow_signup, data.updated_at];
    client.query('UPDATE permissions SET name=$2, note=$3, preferences=$4, active=$5, allow_signup=$6, updated_at=$7 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 12
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateKnowledgeBaseArticleTranslationPublishSchedule = (values, response) => {
    client.query('UPDATE knowledge_base_article_translations SET active=$2, publish_now=$3 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 19
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateKnowledgeBaseArticleTranslationUpdateSchedule = (values, response) => {
    client.query('UPDATE knowledge_base_article_translations SET is_update_scheduled=$2, update_metadata=$3 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 199
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateKnowledgeBaseCategoryTranslationPublishSchedule = (values, response) => {
    client.query('UPDATE knowledge_base_category_translations SET active=$2, publish_now=$3 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 138
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateKnowledgeBaseCategoryTranslationUpdateSchedule = (values, response) => {
    client.query('UPDATE knowledge_base_category_translations SET is_update_scheduled=$2, update_metadata=$3, ui_color=$4 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 239
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateKnowledgeBaseCategoryTranslationUpdateScheduleIsUpdate = (values, response) => {
    client.query('UPDATE knowledge_base_category_translations SET is_update_scheduled=$2 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 239
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateKnowledgeBaseCategoryTranslationDeleteSchedule = (values, response) => {
    client.query('UPDATE knowledge_base_category_translations SET is_delete_scheduled=$2, ui_color=$3 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 2239
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateKnowledgeBaseArticleTranslationDeleteSchedule = (values, response) => {
    client.query('UPDATE knowledge_base_article_translations SET is_delete_scheduled=$2 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 22839
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const getAllKnowledgeBaseArticlesByKnowledgeBaseIdAndLocaleId = (values, response) => {
    pool.query("SELECT * from knowledge_base_article_translations WHERE knowledge_base_id=$1 AND kb_locale_id=$2", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 383829
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};


const deletePermission = (data, response) => {
    const values = [data.id];
    client.query('DELETE FROM permissions WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 13
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};



const getKnowledgeBaseCategoryDelayedJobByKnowledgeBaseId = (kb_id, response) => {
    pool.query(`SELECT * from knowledge_base_category_delayed_jobs WHERE knowledge_base_id=${kb_id}`, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 383829
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getKnowledgeBaseCategoryDelayedJobByKnowledgeBaseCategoryTranslationId = (kb_category_translation_id, response) => {
    pool.query(`SELECT * from knowledge_base_category_delayed_jobs WHERE knowledge_base_category_translation_id=${kb_category_translation_id}`, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 38392
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getKnowledgeBaseArticleDelayedJob = (kb_article_translation_id, type, response) => {
    pool.query(`SELECT * from knowledge_base_article_delayed_jobs WHERE knowledge_base_article_translation_id=${kb_article_translation_id} AND publish_update_delete='${type}'`, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 383922
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getAllKnowledgeBaseArticleDelayedJob = (kb_article_translation_id, response) => {
    pool.query(`SELECT * from knowledge_base_article_delayed_jobs WHERE knowledge_base_article_translation_id=${kb_article_translation_id}`, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 3839322
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getKnowledgeBaseCategoryDelayedJob = (kb_category_translation_id, type, response) => {
    pool.query(`SELECT * from knowledge_base_category_delayed_jobs WHERE knowledge_base_category_translation_id=${kb_category_translation_id} AND publish_update_delete='${type}'`, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 3803922
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getAllKnowledgeBaseCategoryDelayedJob = (kb_category_translation_id, response) => {
    pool.query(`SELECT * from knowledge_base_category_delayed_jobs WHERE knowledge_base_category_translation_id=${kb_category_translation_id}`, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 38032922
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createKnowledgeBaseArticleDelayedJob = (values, response) => {
    client.query('INSERT INTO knowledge_base_article_delayed_jobs (knowledge_base_id, knowledge_base_article_id, knowledge_base_article_translation_id, run_at, publish_update_delete) VALUES($1, $2, $3, $4, $5) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 1190
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const createKnowledgeBaseCategoryDelayedJob = (values, response) => {
    client.query('INSERT INTO knowledge_base_category_delayed_jobs (knowledge_base_category_translation_id, run_at, knowledge_base_id, publish_update_delete) VALUES($1, $2, $3, $4) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 11
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteKnowledgeBaseCategoryDelayedJob = (values, response) => {
    client.query('DELETE FROM knowledge_base_category_delayed_jobs WHERE knowledge_base_category_translation_id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 13
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteKnowledgeBaseCategoryDelayedJobByScheduleType = (values, response) => {
    client.query('DELETE FROM knowledge_base_category_delayed_jobs WHERE knowledge_base_category_translation_id=$1 AND publish_update_delete=$2', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 131
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteKnowledgeBaseArticleDelayedJob = (values, response) => {
    client.query('DELETE FROM knowledge_base_article_delayed_jobs WHERE knowledge_base_article_translation_id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 15
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteKnowledgeBaseArticleDelayedJobByScheduleType = (values, response) => {
    client.query('DELETE FROM knowledge_base_article_delayed_jobs WHERE knowledge_base_article_translation_id=$1 AND publish_update_delete=$2', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 15
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateKnowledgeBaseCategoryTranslationUpdateMetaData = (values, response) => {
    client.query('UPDATE knowledge_base_category_translations SET update_metadata=$2 WHERE id=$1 RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 234821
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateKnowledgeBaseArticleTranslationUpdateMetaData = (values, response) => {
    client.query('UPDATE knowledge_base_article_translations SET update_metadata=$2 WHERE id=$1 RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 234821
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateKnowledgeBaseArchivedStatus = (values, response) => {
    client.query('UPDATE knowledge_bases SET is_archived=$2 WHERE id=$1 RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 234821
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateKnowledgeBaseTranslationArchivedStatusByKBId = (values, response) => {
    client.query('UPDATE knowledge_base_translations SET is_archived=$2 WHERE knowledge_base_id=$1 RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 234821
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateKnowledgeBaseCategoriesArchivedStatusByKBId = (values, response) => {
    client.query('UPDATE knowledge_base_categories SET is_archived=$2 WHERE knowledge_base_id=$1 RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 234821
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateKnowledgeBaseCategoryTranslationsArchivedStatusByKBId = (values, response) => {
    client.query('UPDATE knowledge_base_category_translations SET is_archived=$2 WHERE knowledge_base_id=$1 RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 234821
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateKnowledgeBaseArticlesArchivedStatusByKBId = (values, response) => {
    client.query('UPDATE knowledge_base_articles SET is_archived=$2 WHERE knowledge_base_id=$1 RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 234821
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateKnowledgeBaseArticleTranslationsArchivedStatusByKBId = (values, response) => {
    client.query('UPDATE knowledge_base_article_translations SET is_archived=$2 WHERE knowledge_base_id=$1 RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 234821
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateKnowledgeBaseCategoriesArchivedStatusByCategoryId = (values, response) => {
    client.query('UPDATE knowledge_base_categories SET is_archived=$2 WHERE id=$1 RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 234821
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateKnowledgeBaseCategoryTranslationsArchivedStatusByCategoryId = (values, response) => {
    client.query('UPDATE knowledge_base_category_translations SET is_archived=$2, ui_color=$3 WHERE category_id=$1 RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 234821
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateKnowledgeBaseCategoryTranslationsArchivedStatusById = (values, response) => {
    client.query('UPDATE knowledge_base_category_translations SET is_archived=$2 WHERE id=$1 RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 234821
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateKnowledgeBaseArticlesArchivedStatusByCategoryId = (values, response) => {
    client.query('UPDATE knowledge_base_articles SET is_archived=$2 WHERE category_id=$1 RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 234821
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateKnowledgeBaseArticleTranslationsArchivedStatusByCategoryId = (values, response) => {
    client.query('UPDATE knowledge_base_article_translations SET is_archived=$2, ui_color=$3 WHERE category_id=$1 RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 234821
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateKnowledgeBaseArticlesArchivedStatusByArticleId = (values, response) => {
    client.query('UPDATE knowledge_base_articles SET is_archived=$2 WHERE id=$1 RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 234821
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateKnowledgeBaseArticleTranslationsArchivedStatusByArticleId = (values, response) => {
    client.query('UPDATE knowledge_base_article_translations SET is_archived=$2 WHERE article_id=$1 RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 234821
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateKnowledgeBaseTranslationUiColor = (values, response) => {
    client.query('UPDATE knowledge_base_translations SET ui_color=$2 WHERE id=$1 RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 234821
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};


const createActivityStream = (values, response) => {
    client.query('INSERT INTO activity_streams (activity_type, activity_name, metadata) VALUES($1, $2, $3) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 1190
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};


const createKnowledgeBaseList = (values, response) => {
    client.query('INSERT INTO knowledge_base_lists (knowledge_base_id, list_type, title, position) VALUES($1, $2, $3, $4) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 3282
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const getKnowledgeBaseLists = (values, response) => {
    pool.query("SELECT * from knowledge_base_lists WHERE knowledge_base_id=$1 AND list_type=$2", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getKnowledgeBaseArticleDelayedJobByKnowledgeBaseId = (kb_id, response) => {
    pool.query(`SELECT * from knowledge_base_article_delayed_jobs WHERE knowledge_base_id=${kb_id}`, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 383829
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};


const getKnowledgeBaseListsByKnowledgeBaseId = (kb_id, response) => {
    pool.query(`SELECT * from knowledge_base_lists WHERE knowledge_base_id=${kb_id}`, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 383829
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};


const getKnowledgeBaseListById = (id, response) => {
    pool.query(`SELECT * from knowledge_base_lists WHERE id=${id}`, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 383829
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

module.exports = {
    updatePositionForKnowledgeBase,
    listKnowledgeBasesById,
    listKnowledgeBases,
    createKnowledgeBase,
    updateKnowledgeBase,
    deleteKnowledgeBase,

    getKnowledgeBaseTranslationsById,
    getKnowledgeBaseTranslationsByKnowledgeBaseId,
    listKnowledgeBaseTranslations,
    createKnowledgeBaseTranslation,
    updateKnowledgeBaseTranslation,
    updatePositionForKnowledgeBaseTranslation,
    deleteKnowledgeBaseTranslation,
    deleteKnowledgeBaseTranslationByKnowledgeBaseId,

    listKnowledgeBaseCategoriesById,
    listKnowledgeBaseCategoriesByKnowledgeBaseId,
    getKnowledgeBaseCategoriesByKnowledgeBaseIdAndParentId,
    getKnowledgeBaseCategoriesByKnowledgeBaseIdAndCategoryId,
    getKnowledgeBaseCategoryTranslationsByKnowledgeBaseIdAndCategoryId,
    getKnowledgeBaseCategoriesByParentId,
    getKnowledgeBaseCategoryTranslationsByCategoryIdAndLocaleId,
    listKnowledgeBaseCategories,
    createKnowledgeBaseCategory,
    updateKnowledgeBaseCategory,
    updateKnowledgeBaseCategoryParentIdById,
    updatePositionForKnowledgeBaseCategory,
    deleteKnowledgeBaseCategory,

    getKnowledgeBaseCategoryTranslationsByCategoryId,
    getKnowledgeBaseCategoryTranslationByLocaleId,
    getKnowledgeBaseCategoryTranslationByCategoryIdAndLocaleId,
    getKnowledgeBaseCategoryTranslations,
    createKnowledgeBaseCategoryTranslation,
    updateKnowledgeBaseCategoryTranslation,
    updateKnowledgeBaseCategoryTranslationsUIColor,
    deleteKnowledgeBaseCategoryTranslationsByCategoryId,
    deleteKnowledgeBaseCategoryTranslationById,
    getKnowledgeBaseCategoryTranslationsByKnowledgeBaseIdAndLocaleId,
    getKnowledgeBaseCategoryTranslationsByKnowledgeBaseIdCategoryIdAndLocaleId,

    getKnowledgeBaseArticlesById,
    getKnowledgeBaseArticlesByKnowledgeBaseId,
    getKnowledgeBaseArticlesByKnowledgeBaseIdAndCategoryId,
    getKnowledgeBaseArticlesByKnowledgeBaseCategoryId,
    listKnowledgeBaseArticles,
    createKnowledgeBaseArticle,
    updatePositionForKnowledgeBaseArticle,
    updateKnowledgeBaseArticle,
    deleteKnowledgeBaseArticle,
    deleteKnowledgeBaseArticleTranslationByArticleId,

    getKnowledgeBaseArticleTranslationByArticleIdAndLocaleId,
    getKnowledgeBaseArticleTranslationsByKnowledgeBaseIdAndCategoryId,
    getKnowledgeBaseArticleTranslationByArticleId,
    getKnowledgeBaseArticleTranslationByKnowledgeBaseIdAndLocaleId,
    getKnowledgeBaseArticleTranslationsByCategoryIdAndLocaleId,
    getKnowledgeBaseArticleTranslationsByKnowledgeBaseIdCategoryIdAndLocaleId,
    listKnowledgeBaseArticleTranslations,
    createKnowledgeBaseArticleTranslation,
    updateKnowledgeBaseArticleTranslation,
    updateKnowledgeBaseArticleTranslationsUIColor,
    deleteKnowledgeBaseArticleTranslation,
    getKnowledgeBaseArticleTranslationsByCategoryId,

    getLocaleById,
    listLocales,
    createLocale,
    updateLocale,
    deleteLocale,

    listKnowledgeBaseLocales,
    createKnowledgeBaseLocales,
    updateKnowledgeBaseLocales,
    deleteKnowledgeBaseLocales,

    listCalendars,
    createCalendar,
    updateCalendar,
    deleteCalendar,

    listDelayedJobs,
    createDelayedJob,
    updateDelayedJob,
    deleteDelayedJob,

    listGroups,
    createGroup,
    updateGroup,
    deleteGroup,

    listPermissionsGroups,
    createPermissionsGroup,
    updatePermissionsGroup,
    deletePermissionsGroup,

    listPermissions,
    createPermission,
    updatePermission,
    deletePermission,

    getKnowledgeBaseCategoryDelayedJobByKnowledgeBaseId,
    getKnowledgeBaseCategoryDelayedJobByKnowledgeBaseCategoryTranslationId,
    createKnowledgeBaseCategoryDelayedJob,
    deleteKnowledgeBaseCategoryDelayedJob,
    deleteKnowledgeBaseCategoryDelayedJobByScheduleType,

    createKnowledgeBaseArticleDelayedJob,
    deleteKnowledgeBaseArticleDelayedJob,
    deleteKnowledgeBaseArticleDelayedJobByScheduleType,

    updateKnowledgeBaseCategoryTranslationUpdateMetaData,
    updateKnowledgeBaseArticleTranslationUpdateMetaData,

    getKnowledgeBaseCategoryDelayedJob,
    getKnowledgeBaseArticleDelayedJob,
    getAllKnowledgeBaseCategoryDelayedJob,
    getAllKnowledgeBaseArticleDelayedJob,

    updateKnowledgeBaseArticleTranslationPublishSchedule,
    updateKnowledgeBaseArticleTranslationUpdateSchedule,
    updateKnowledgeBaseArticleTranslationDeleteSchedule,

    updateKnowledgeBaseCategoryTranslationPublishSchedule,
    updateKnowledgeBaseCategoryTranslationUpdateSchedule,
    updateKnowledgeBaseCategoryTranslationUpdateScheduleIsUpdate,
    updateKnowledgeBaseCategoryTranslationDeleteSchedule,

    getAllKnowledgeBaseArticlesByKnowledgeBaseIdAndLocaleId,
    getKnowledgeBaseArticleDelayedJobByKnowledgeBaseId,

    updateKnowledgeBaseArchivedStatus,
    updateKnowledgeBaseTranslationArchivedStatusByKBId,
    updateKnowledgeBaseCategoriesArchivedStatusByKBId,
    updateKnowledgeBaseCategoryTranslationsArchivedStatusByKBId,
    updateKnowledgeBaseArticlesArchivedStatusByKBId,
    updateKnowledgeBaseArticleTranslationsArchivedStatusByKBId,

    updateKnowledgeBaseCategoriesArchivedStatusByCategoryId,
    updateKnowledgeBaseCategoryTranslationsArchivedStatusByCategoryId,
    updateKnowledgeBaseCategoryTranslationsArchivedStatusById,
    updateKnowledgeBaseArticlesArchivedStatusByCategoryId,
    updateKnowledgeBaseArticleTranslationsArchivedStatusByCategoryId,

    updateKnowledgeBaseArticlesArchivedStatusByArticleId,
    updateKnowledgeBaseArticleTranslationsArchivedStatusByArticleId,

    updateKnowledgeBaseTranslationUiColor,

    createActivityStream,

    createKnowledgeBaseList,
    getKnowledgeBaseLists,

    getKnowledgeBaseListsByKnowledgeBaseId,
    getKnowledgeBaseListById
}
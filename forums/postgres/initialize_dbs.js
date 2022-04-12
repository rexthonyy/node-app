const { Pool, Client } = require('pg');

let pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: "postgres",
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
});

let client = null;

const databaseName = process.env.KB_DB;
/*
    first create a postgres user called knowledgebase
    second setup the postgres consts variables
    third run the app
*/

const init = () => {
    return new Promise((resolve, reject) => {
        return resolve();

        createKnowledgeBaseDatabase(() => {
            console.log("Forums database created successfully");
            resolve();
        });
    });
}

function createKnowledgeBaseDatabase(cb){
    pool.query(`CREATE DATABASE ${databaseName}`, (err, res) => {
        if(err){
            //console.log(err);
            return cb();
        }
        pool.end();

        pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: databaseName,
            password: process.env.DB_PASS,
            port: process.env.DB_PORT
        });

        client = new Client({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: databaseName,
            password: process.env.DB_PASS,
            port: process.env.DB_PORT
        });
        client.connect();

        createKnowledgeBaseTB(() => {
            console.log("Done creating knowledge base table");
            createKnowledgeBaseTranslationsTB(() => {
                console.log("Done creating knowledge base translation table");
                createKnowledgeBaseCategoriesTB(() => {
                    console.log("Done creating knowledge base categories table");
                    createKnowledgeBaseCategoryTranslationsTB(() => {
                        console.log("Done creating knowledge base category translations table");
                        createKnowledgeBaseCategoryDelayedJobsTB(() => {
                            console.log("Done creating knowledge base category delayed jobs table");
                            createKnowledgeBaseArticlesTB(() => {
                                console.log("Done creating knowledge base article table");
                                createKnowledgeBaseArticleTranslationsTB(() => {
                                    console.log("Done creating knowledge base article translations table");
                                    createKnowledgeBaseArticleDelayedJobsTB(() => {
                                        console.log("Done creating knowledge base article delayed jobs table");
                                        createKnowledgeBaseListTB(() => {
                                            console.log("Done creating knowledge base list table");
                                            createActivityStreamsTB(() => {
                                                console.log("Done creating activity streams table");
                                                createLocalesTB(() => {
                                                    console.log("Done creating locales table");
                                                    cb();
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
    });
}

function createKnowledgeBaseTB(cb){
    let query = 
    `CREATE TABLE IF NOT EXISTS knowledge_bases (
        id serial primary key not null, 
        name varchar,
        icon varchar, 
        footer text, 
        created_at timestamp without time zone not null default timezone('utc'::text, now()), 
        homepage_layout varchar, 
        category_layout varchar, 
        active boolean, 
        updated_at timestamp without time zone not null default timezone('utc'::text, now()), 
        front_page varchar, 
        position integer not null default 1, 
        ui_color varchar default 'red', 
        is_archived boolean not null default false
    )`;
    client.query(query, (err, res) => {
        if(err){
            console.log(err);
        }
        cb();
    });
}

function createKnowledgeBaseTranslationsTB(cb){
    let query = 
    `CREATE TABLE IF NOT EXISTS knowledge_base_translations (
        id serial primary key not null, 
        knowledge_base_id integer not null,
        title varchar, 
        created_at timestamp without time zone not null default timezone('utc'::text, now()), 
        updated_at timestamp without time zone not null default timezone('utc'::text, now()), 
        footer_not varchar, 
        kb_locale_id integer, 
        active boolean default true, 
        position integer not null default 1, 
        ui_color varchar default 'red', 
        is_archived boolean not null default false
    )`;
    client.query(query, (err, res) => {
        if(err){
            console.log(err);
        }
        cb();
    });
}

function createKnowledgeBaseCategoriesTB(cb){
    let query = 
    `CREATE TABLE IF NOT EXISTS knowledge_base_categories (
        id serial primary key not null, 
        knowledge_base_id integer not null,
        parent_id integer,
        position integer not null default 1, 
        created_at timestamp without time zone not null default timezone('utc'::text, now()), 
        updated_at timestamp without time zone not null default timezone('utc'::text, now()), 
        is_archived boolean not null default false
    )`;
    client.query(query, (err, res) => {
        if(err){
            console.log(err);
        }
        cb();
    });
}

function createKnowledgeBaseCategoryTranslationsTB(cb){
    let query = 
    `CREATE TABLE IF NOT EXISTS knowledge_base_category_translations (
        id serial primary key not null, 
        name varchar not null,
        kb_locale_id integer not null,
        category_id integer not null, 
        created_at timestamp without time zone not null default timezone('utc'::text, now()), 
        updated_at timestamp without time zone not null default timezone('utc'::text, now()), 
        ui_color varchar,
        category_icon varchar,
        title_tag varchar,
        footer varchar,
        keywords varchar,
        meta_description varchar,
        publish_now boolean,
        active boolean,
        permission varchar,
        update_metadata text,
        is_delete_scheduled boolean,
        is_update_scheduled boolean,
        knowledge_base_id integer,
        is_archived boolean not null default false,
        list_id integer
    )`;
    client.query(query, (err, res) => {
        if(err){
            console.log(err);
        }
        cb();
    });
}

function createKnowledgeBaseCategoryDelayedJobsTB(cb){
    let query = 
    `CREATE TABLE IF NOT EXISTS knowledge_base_category_delayed_jobs (
        id serial primary key not null, 
        knowledge_base_category_translation_id integer not null,
        run_at timestamp without time zone not null default timezone('utc'::text, now()), 
        created_at timestamp without time zone not null default timezone('utc'::text, now()), 
        knowledge_base_id integer,
        publish_update_delete varchar
    )`;
    client.query(query, (err, res) => {
        if(err){
            console.log(err);
        }
        cb();
    });
}

function createKnowledgeBaseArticlesTB(cb){
    let query = 
    `CREATE TABLE IF NOT EXISTS knowledge_base_articles (
        id serial primary key not null, 
        category integer not null,
        position integer not null,
        updated_at timestamp without time zone not null default timezone('utc'::text, now()), 
        created_at timestamp without time zone not null default timezone('utc'::text, now()), 
        knowledge_base_id integer,
        is_archived boolean not null default false
    )`;
    client.query(query, (err, res) => {
        if(err){
            console.log(err);
        }
        cb();
    });
}

function createKnowledgeBaseArticleTranslationsTB(cb){
    let query = 
    `CREATE TABLE IF NOT EXISTS knowledge_base_article_translations (
        id serial primary key not null, 
        title varchar,
        kb_locale_id integer not null,
        created_at timestamp without time zone not null default timezone('utc'::text, now()), 
        updated_at timestamp without time zone not null default timezone('utc'::text, now()), 
        body text, 
        keywords varchar,
        meta_description varchar,
        article_id integer, 
        active boolean,
        publish_now boolean not null default true,
        update_metadata text,
        is_delete_scheduled boolean default false,
        is_update_scheduled boolean default false,
        knowledge_base_id integer,
        is_archived boolean not null default false,
        category_id integer not null, 
        ui_color varchar not null default 'red',
        list_name varchar,
        position integer default 1,
        list_id integer
    )`;
    client.query(query, (err, res) => {
        if(err){
            console.log(err);
        }
        cb();
    });
}

function createKnowledgeBaseArticleDelayedJobsTB(cb){
    let query = 
    `CREATE TABLE IF NOT EXISTS knowledge_base_article_delayed_jobs (
        id serial primary key not null, 
        knowledge_base_id integer not null,
        knowledge_base_article_id integer not null,
        knowledge_base_article_translation_id integer not null,
        run_at timestamp without time zone not null default timezone('utc'::text, now()), 
        created_at timestamp without time zone not null default timezone('utc'::text, now()), 
        publish_update_delete varchar
    )`;
    client.query(query, (err, res) => {
        if(err){
            console.log(err);
        }
        cb();
    });
}

function createKnowledgeBaseListTB(cb){
    let query = 
    `CREATE TABLE IF NOT EXISTS knowledge_base_lists (
        id serial primary key not null, 
        knowledge_base_id integer not null,
        list_type varchar not null,
        title varchar not null,
        position integer not null,
        created_at timestamp without time zone not null default timezone('utc'::text, now())
    )`;
    client.query(query, (err, res) => {
        if(err){
            console.log(err);
        }
        cb();
    });
}

function createActivityStreamsTB(cb){
    let query = 
    `CREATE TABLE IF NOT EXISTS activity_streams (
        id serial primary key not null, 
        activity_name varchar,
        metadata jsonb,
        created_at timestamp without time zone not null default timezone('utc'::text, now()),
        activity_type varchar
    )`;
    client.query(query, (err, res) => {
        if(err){
            console.log(err);
        }
        cb();
    });
}

function createLocalesTB(cb){
    let query = 
    `CREATE TABLE IF NOT EXISTS locales (
        id serial primary key not null, 
        locale varchar not null,
        alias varchar,
        name varchar not null,
        dir varchar default 'ltr',
        active boolean not null default true,
        created_at timestamp without time zone not null default timezone('utc'::text, now()),
        updated_at timestamp without time zone not null default timezone('utc'::text, now())
    )`;
    client.query(query, (err, res) => {
        if(err){
            console.log(err);
        }
    
        query = 
        `INSERT INTO locales(locale,alias,name) VALUES
            ('en-us','en','English (United States)'),
            ('bg',null,'Bulgarian (Български)'),
            ('cs',null,'Czech (Česky)'),
            ('da',null,'Dansk'),
            ('el',null,'Greek (Ελληνικά)'),
            ('et',null,'Eesti'),
            ('en-ca',null,'English (Canada)'),
            ('en-gb',null,'English (Great Britain)'),
            ('en-es','es','Español'),
            ('en-co',null,'Español (Colombia)'),
            ('es-mx',null,'Español (México)'),
            ('fi',null,'Suomi'),
            ('fr-fr',null,'Français'),
            ('fr-ca',null,'Français (Canada)'),
            ('hr',null,'Hrvatski'),
            ('hu',null,'Magyar'),
            ('it-it',null,'Italiano'),
            ('ja',null,'Japanese (日本語)'),
            ('lt',null,'Lietuvių kalba'),
            ('lv',null,'Latvijas'),
            ('no-no','nb','Norsk bokmål'),
            ('nl-nl','nl','Nederlands'),
            ('pl',null,'Polski'),
            ('pt-pt','pt','Português'),
            ('pt-bt','pt','Português Brasileiro'),
            ('ru',null,'Russian (Русский)'),
            ('sk',null,'Slovak (Slovenčina)'),
            ('sl',null,'Slovenian (Slovenčina)'),
            ('sv-se','sv','Svenska'),
            ('tr',null,'Türkçe'),
            ('uk',null,'Ukrainian (Українська)'),
            ('vi',null,'Vietnam (ViɆt Nam)'),
            ('zh-cn',null,'Chinese (Sim.) (简体中文)'),
            ('hi-in','hi','Hindi (हिंदी)'),
            ('de-de','de','Deutsch'),
            ('he-il',null,'Hebrew (עִבְרִית)'),
            ('fa-ir','fa','Persian (فارسى)'),
            ('ms-my','ms','Malay (Bahasa Malaysia)'),
            ('ro-ro','ro','Romanian (Românesc)'),
            ('ar','ar','Arabic'),
            ('sr-latn-rs','sr','Serbian (srpski)'),
            ('is',null,'Icelandic (Íslenska)'),
            ('rw',null,'Ikinyarwanda'),
            ('ko-kr','ko','Korean (한국어)'),
            ('es-ca','ko','Català'),
            ('zh-tw',null,'Chinese (Trad.) (繁體中文)')`;

        client.query(query, (err, res) => {
            if (err) {
                console.error(err);
            } 
            cb();
        });
    });
}

module.exports = {
    init
};
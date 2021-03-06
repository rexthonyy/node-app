const { Pool, Client } = require('pg');

let pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: "postgres",
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT
});

let client = null;

const databaseName = process.env.POSTGRES_DB;
/*
    first create a postgres user called knowledgebase
    second setup the postgres consts variables
    third run the app
*/

const init = () => {
    return new Promise((resolve, reject) => {
        createKnowledgeBaseDatabase(() => {
            console.log("Knowledge base database created successfully");
            resolve();
        });
    });
}

function createKnowledgeBaseDatabase(cb){
    pool.query("CREATE DATABASE $1", [databaseName], (err, res) => {
        if(err){
            return cb();
        }
        pool.end();

        pool = new Pool({
            user: process.env.POSTGRES_USER,
            host: process.env.POSTGRES_HOST,
            database: databaseName,
            password: process.env.POSTGRES_PASSWORD,
            port: process.env.POSTGRES_PORT
        });

        client = new Client({
            user: process.env.POSTGRES_USER,
            host: process.env.POSTGRES_HOST,
            database: databaseName,
            password: process.env.POSTGRES_PASSWORD,
            port: process.env.POSTGRES_PORT
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
            err.errorIndex = 2;
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
            err.errorIndex = 21;
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
            err.errorIndex = 200;
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
            err.errorIndex = 321;
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
            err.errorIndex = 311;
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
            err.errorIndex = 301;
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
            err.errorIndex = 391;
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
            err.errorIndex = 322;
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
            err.errorIndex = 324;
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
            err.errorIndex = 412;
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
            err.errorIndex = 122;
            console.log(err);
        }
    
        query = 
        `INSERT INTO locales(locale,alias,name) VALUES
            ('en-us','en','English (United States)'),
            ('bg',null,'Bulgarian (??????????????????)'),
            ('cs',null,'Czech (??esky)'),
            ('da',null,'Dansk'),
            ('el',null,'Greek (????????????????)'),
            ('et',null,'Eesti'),
            ('en-ca',null,'English (Canada)'),
            ('en-gb',null,'English (Great Britain)'),
            ('en-es','es','Espa??ol'),
            ('en-co',null,'Espa??ol (Colombia)'),
            ('es-mx',null,'Espa??ol (M??xico)'),
            ('fi',null,'Suomi'),
            ('fr-fr',null,'Fran??ais'),
            ('fr-ca',null,'Fran??ais (Canada)'),
            ('hr',null,'Hrvatski'),
            ('hu',null,'Magyar'),
            ('it-it',null,'Italiano'),
            ('ja',null,'Japanese (?????????)'),
            ('lt',null,'Lietuvi?? kalba'),
            ('lv',null,'Latvijas'),
            ('no-no','nb','Norsk bokm??l'),
            ('nl-nl','nl','Nederlands'),
            ('pl',null,'Polski'),
            ('pt-pt','pt','Portugu??s'),
            ('pt-bt','pt','Portugu??s Brasileiro'),
            ('ru',null,'Russian (??????????????)'),
            ('sk',null,'Slovak (Sloven??ina)'),
            ('sl',null,'Slovenian (Sloven??ina)'),
            ('sv-se','sv','Svenska'),
            ('tr',null,'T??rk??e'),
            ('uk',null,'Ukrainian (????????????????????)'),
            ('vi',null,'Vietnam (Vi??t Nam)'),
            ('zh-cn',null,'Chinese (Sim.) (????????????)'),
            ('hi-in','hi','Hindi (???????????????)'),
            ('de-de','de','Deutsch'),
            ('he-il',null,'Hebrew (????????????????)'),
            ('fa-ir','fa','Persian (??????????)'),
            ('ms-my','ms','Malay (Bahasa Malaysia)'),
            ('ro-ro','ro','Romanian (Rom??nesc)'),
            ('ar','ar','Arabic'),
            ('sr-latn-rs','sr','Serbian (srpski)'),
            ('is',null,'Icelandic (??slenska)'),
            ('rw',null,'Ikinyarwanda'),
            ('ko-kr','ko','Korean (?????????)'),
            ('es-ca','ko','Catal??'),
            ('zh-tw',null,'Chinese (Trad.) (????????????)')`;

        client.query(query, (er) => {
            if (er) {
                er.erorIndex = 500;
                console.log(er);
            } 
            cb();
        });
    });
}

module.exports = {
    init
};
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
        createSettingsDatabase(() => {
            console.log("Settings database created successfully");
            resolve();
        });
    });
}

function createSettingsDatabase(cb){
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

        createLocalesTB(() => {
            console.log("Done creating locales table");
            cb();
        });                           
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
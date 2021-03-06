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
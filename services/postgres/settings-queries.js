const { Pool, Client } = require('pg');
const { DB } = require('../consts');

const pool = new Pool({
    user: process.env.SETTINGS_POSTGRES_USER,
    host: process.env.SETTINGS_POSTGRES_HOST,
    database: process.env.SETTINGS_POSTGRES_DB,
    password: process.env.SETTINGS_POSTGRES_PASSWORD,
    port: process.env.SETTINGS_POSTGRES_PORT
});

pool.query('SELECT NOW()', (err, res) => {
    if(err){
        console.log(`${process.env.SETTINGS_POSTGRES_DB} database initialization failed!!!`);
    }else{
        console.log(`${process.env.SETTINGS_POSTGRES_DB} database initialized successfully!!!`);
    }
});

const client = new Client({
    user: process.env.SETTINGS_POSTGRES_USER,
    host: process.env.SETTINGS_POSTGRES_HOST,
    database: process.env.SETTINGS_POSTGRES_DB,
    password: process.env.SETTINGS_POSTGRES_PASSWORD,
    port: process.env.SETTINGS_POSTGRES_PORT
});
client.connect();

const getPageTranslations = response => {
    client.query(`SELECT * from ${DB.page_translations}`, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 205
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};


module.exports = {
    getPageTranslations
}
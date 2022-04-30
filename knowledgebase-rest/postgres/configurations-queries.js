const { Pool, Client } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'configurations_db',
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
});

pool.query('SELECT NOW()', (err, res) => {
    if(err){
        console.log("configurations_db app databse initialization failed!!!");
    }else{
        console.log("configurations_db app databse initialized successfully!!!");
    }
});

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'configurations_db',
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
});
client.connect();

const getLocales = (response) => {
    pool.query("SELECT * from locales", (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 0
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createLocale = (values, response) => {
    client.query('INSERT INTO locales(locale, name) VALUES($1, $2) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 1
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateLocale = (values, response) => {
    client.query('UPDATE locales SET locale=$2, name=$3 WHERE id=$1', values, (err, res) => {
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


const getLanguageTranslations = (values, response) => {
    pool.query("SELECT * from language_translations WHERE locale_id=$1", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 0
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createLanguage = (values, response) => {
    client.query('INSERT INTO languages(position) VALUES($1) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 3
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteLanguage = (values, response) => {
    client.query('DELETE FROM languages WHERE id=$1', values, (err, res) => {
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


const getCurrencyTranslations = (values, response) => {
    pool.query("SELECT * from currency_translations WHERE locale_id=$1", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: -1
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createLanguageTranslation = (values, response) => {
    client.query('INSERT INTO language_translations (language_id, locale_id, name, locale) VALUES($1,$2,$3,$4) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 3
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteLanguageTranslations = (values, response) => {
    client.query('DELETE FROM language_translations WHERE language_id=$1', values, (err, res) => {
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

const createCurrency = (values, response) => {
    client.query('INSERT INTO currencies (position) VALUES($1) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 6
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const createCurrencyTranslation = (values, response) => {
    client.query('INSERT INTO currency_translations (currency_id, locale_id, name, symbol, code, exchange_rate) VALUES($1,$2,$3,$4,$5,$6) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 7
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const createExchangeRateUpdateLogs = (values, response) => {
    client.query('INSERT INTO exchange_rate_update_logs (currency_translation_id, type, log, user_id) VALUES($1,$2,$3,$4) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 8
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteCurrency = (values, response) => {
    client.query('DELETE FROM currencies WHERE id=$1', values, (err, res) => {
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

const deleteCurrencyTranslations = (values, response) => {
    client.query('DELETE FROM currency_translations WHERE currency_id=$1', values, (err, res) => {
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


const updateCurrencyTranslation = (values, response) => {
    client.query('UPDATE currency_translations SET name=$2, symbol=$3, code=$4 WHERE id=$1', values, (err, res) => {
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

const updateCurrencyTranslationExchangeRate = (values, response) => {
    client.query('UPDATE currency_translations SET exchange_rate=$2 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 22
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};



const getConfigForSlug = (values, response) => {
    pool.query("SELECT * from config WHERE slug=$1", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: -1
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateConfigForSlug = (values, response) => {
    client.query("UPDATE config SET metadata=$2 WHERE slug=$1", values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 22
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

module.exports = {
    getLocales,
    createLocale,
    updateLocale,
    
    getLanguageTranslations,
    createLanguage,
    createLanguageTranslation,
    deleteLanguage,
    deleteLanguageTranslations,

    getCurrencyTranslations,
    createCurrency,
    createCurrencyTranslation,
    createExchangeRateUpdateLogs,
    deleteCurrency,
    deleteCurrencyTranslations,
    updateCurrencyTranslation,
    updateCurrencyTranslationExchangeRate,

    getConfigForSlug,
    updateConfigForSlug
}
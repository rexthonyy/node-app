const { Pool, Client } = require('pg');
const { db }  = require('../libs/consts');

const pool = new Pool({
    user: process.env.POSTGRES_SALEOR_USER,
    host: process.env.POSTGRES_SALEOR_HOST,
    database: process.env.POSTGRES_SALEOR_DB,
    password: process.env.POSTGRES_SALEOR_PASSWORD,
    port: process.env.POSTGRES_SALEOR_PORT
});

pool.query('SELECT NOW()', (err, res) => {
    if(err){
        console.log(`${process.env.POSTGRES_SALEOR_DB} database initialization failed!!!`);
    }else{
        console.log(`${process.env.POSTGRES_SALEOR_DB} database initialized successfully!!!`);
    }
});

const client = new Client({
    user: process.env.POSTGRES_SALEOR_USER,
    host: process.env.POSTGRES_SALEOR_HOST,
    database: process.env.POSTGRES_SALEOR_DB,
    password: process.env.POSTGRES_SALEOR_PASSWORD,
    port: process.env.POSTGRES_SALEOR_PORT
});
client.connect();

const getUserId = (values, response) => {
    pool.query(`SELECT * from ${db.oauth_sessions} WHERE id=$1`, values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                code: 201
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getUserByEmailAndPassword = (values, response) => {
    pool.query(`SELECT * from ${db.oauth_sessions} WHERE email=$1 AND password=$2`, values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                code: 202
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getUsers = (response) => {
    pool.query(`SELECT * from ${db.oauth_sessions}`, values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                code: 203
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
    getUserId,
    getUserByEmailAndPassword,
    getUsers
}
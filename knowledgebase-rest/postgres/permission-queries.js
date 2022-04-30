const { Pool, Client } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'knowledgebase',
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
});

pool.query('SELECT NOW()', (err, res) => {
    if(err){
        console.log("Permissions query initialization failed!!!");
    }else{
        console.log("Permissions query initialized successfully!!!");
    }
});

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'knowledgebase',
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
});
client.connect();


const getPermissions = (response) => {
    pool.query("SELECT * from permissions", (err, res) => {
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

module.exports = {
    getPermissions
}
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
        console.log("macros databse initialization failed!!!");
    }else{
        console.log("macros databse initialized successfully!!!");
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

const getTagObjectById = (values, response) => {
    pool.query("SELECT * from tag_objects WHERE id=$1", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                test: 201
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getTagObjectsByName = (values, response) => {
    pool.query("SELECT * from tag_objects WHERE name=$1", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                test: 201
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getTagItemById = (values, response) => {
    pool.query("SELECT * from tag_items WHERE id=$1", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                test: 202
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getTagItemByName = (values, response) => {
    pool.query("SELECT * from tag_items WHERE name_downcase=$1", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                test: 202
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createMacros = (values, response) => {
    client.query('INSERT INTO macros (name, perform, active, ux_flow_next_up, note, updated_by_id, created_by_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: "32f"
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const createGroupMacros = (values, response) => {
    client.query('INSERT INTO groups_macros (macro_id, group_id) VALUES($1, $2) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: "32f"
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
    getTagObjectById,
    getTagObjectsByName,
    getTagItemById,
    getTagItemByName,



    createMacros,
    createGroupMacros
};
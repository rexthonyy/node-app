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
        console.log("tags databse initialization failed!!!");
    }else{
        console.log("tags databse initialized successfully!!!");
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

const createTag= (values, response) => {
    client.query('INSERT INTO tags (tag_item_id, tag_object_id, o_id, created_by_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING *', values, (err, res) => {
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

const createTagItem = (values, response) => {
    client.query('INSERT INTO tag_items (name, name_downcase, created_at, updated_at) VALUES($1, $2, $3, $4) RETURNING *', values, (err, res) => {
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

const createTagObject = (values, response) => {
    client.query('INSERT INTO tag_objects (name, created_at, updated_at) VALUES($1, $2, $3) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: "32ds"
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const searchTagItems = (query, response) => {
    pool.query(`SELECT * from tag_items WHERE name ILIKE '%${query}%'`, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                test: 121
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getTagsByO_id = (values, response) => {
    pool.query("SELECT * from tags WHERE tag_item_id=$1, tag_object_id=$2, o_id=$3", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                test: 75
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getTagsByObjectIdAndItemId = (values, response) => {
    pool.query("SELECT * from tags WHERE tag_item_id=$2, tag_object_id=$1", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                test: 75
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getTagsByItemId = (values, response) => {
    pool.query("SELECT * from tags WHERE tag_item_id=$1", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                test: 75
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};


const getTagsByObjectId = (values, response) => {
    pool.query("SELECT * from tags WHERE tag_object_id=$1", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                test: 75
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteTagsByO_id = (values, response) => {
    client.query('DELETE FROM tags WHERE tag_item_id=$1, tag_object_id=$2, o_id=$3', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 471
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
    getTagsByItemId,
    searchTagItems,
    getTagsByObjectIdAndItemId,
    getTagItemByName,
    createTag,
    createTagItem,
    createTagObject,

    getTagsByO_id,
    getTagsByObjectId,
    deleteTagsByO_id
}
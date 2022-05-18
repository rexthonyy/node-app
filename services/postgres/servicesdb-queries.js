const { Pool, Client } = require('pg');

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT
});

pool.query('SELECT NOW()', (err, res) => {
    if(err){
        console.log("SpiceDB database initialization failed!!!");
    }else{
        console.log("SpiceDB database initialized successfully!!!");
    }
});

const client = new Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT
});
client.connect();

const getRelationTuplesByRelation = (values, response) => {
    pool.query("SELECT * from relation_tuple WHERE relation=$1", values, (err, res) => {
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

const getRelationTuplesByNamespaceObjectIdAndRelation = (values, response) => {
    pool.query("SELECT * from relation_tuple WHERE namespace=$1 AND object_id=$2 AND relation=$3", values, (err, res) => {
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

const deleteRelationTuples = (whereClause, values, response) => {
    client.query(`DELETE FROM relation_tuple WHERE ${whereClause} RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 203
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const getRelationTuplesByNamespaceAndRelation = (values, response) => {
    pool.query("SELECT * from relation_tuple WHERE namespace=$1 AND relation=$2", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                code: 204
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getRelationTuples = (whereClause, values, response) => {
    client.query(`SELECT * from relation_tuple WHERE ${whereClause}`, values, (err, res) => {
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

const createRelationTuple = (values, response) => {
    values = values.concat("subject", "resource", "permission", Date.now(), Date.now());
    client.query('INSERT INTO relation_tuple (namespace, object_id, relation, userset_namespace, userset_object_id, userset_relation, created_transaction, deleted_transaction) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 206
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
    getRelationTuplesByRelation,
    getRelationTuplesByNamespaceObjectIdAndRelation,
    deleteRelationTuples,
    getRelationTuplesByNamespaceAndRelation,
    getRelationTuples,
    createRelationTuple
}
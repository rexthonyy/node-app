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
    console.log(values);
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

module.exports = {
    getRelationTuplesByRelation,
    getRelationTuplesByNamespaceObjectIdAndRelation
}
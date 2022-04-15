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

const getGroupMacrosByMacroId = (values, response) => {
    pool.query("SELECT * from groups_macros WHERE macro_id=$1", values, (err, res) => {
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

const getMacrosById = (values, response) => {
    pool.query("SELECT * from macros WHERE id=$1", values, (err, res) => {
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

const getMacros = response => {
    pool.query("SELECT * from macros", (err, res) => {
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

const updateMacro = (values, response) => {
    client.query('UPDATE macros SET name=$2, perform=$3, active=$4, ux_flow_next_up=$5, note=$6, updated_by_id=$7, created_by_id=$8, created_at=$9, updated_at=$10 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 27
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteGroupMacrosByMacroId = (values, response) => {
    client.query('DELETE FROM groups_macros WHERE macro_id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
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
    createMacros,
    createGroupMacros,
    getMacros,
    getMacrosById,
    getGroupMacrosByMacroId,
    updateMacro,
    deleteGroupMacrosByMacroId
};
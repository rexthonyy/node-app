const { Pool, Client } = require('pg');
const { DB } = require('../consts');

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT
});

pool.query('SELECT NOW()', (err, res) => {
    if(err){
        console.log(`${process.env.POSTGRES_DB} database initialization failed!!!`);
    }else{
        console.log(`${process.env.POSTGRES_DB} database initialized successfully!!!`);
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

const getAllBranches = response => {
    client.query(`SELECT * from ${DB.branch}`, (err, res) => {
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

const getAllBranchTranslationsByBranchIdAndLocaleId = (values, response) => {
    client.query(`SELECT * from ${DB.branch_translation} WHERE branch_id=$1 AND locale_id=$2`, values, (err, res) => {
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

const createBranch = (values, response) => {
    client.query(`INSERT INTO ${DB.branch} (position, is_archived) VALUES ($1, $2) RETURNING *`, values, (err, res) => {
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

const createBranchTranslation = (values, response) => {
    client.query(`INSERT INTO ${DB.branch_translation} (branch_id, locale_id, name, address, location, ref, ui_color) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, values, (err, res) => {
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

const updateBranchTranslation = (values, response) => {
    client.query(`UPDATE ${DB.branch_translation} SET branch_id=$1, locale_id=$2, name=$3, address=$4, location=$5, ref=$6, ui_color=$7 WHERE branch_id=$1 AND locale_id=$2 RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 8301
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};


const deleteBranchById = (values, response) => {
    client.query(`DELETE FROM ${DB.branch} WHERE id=$1`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 233
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteBranchTranslationByBranchId = (values, response) => {
    client.query(`DELETE FROM ${DB.branch_translation} WHERE branch_id=$1`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 233
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
    getAllBranches,
    createBranch,
    createBranchTranslation,
    getAllBranchTranslationsByBranchIdAndLocaleId,
    updateBranchTranslation,
    deleteBranchById,
    deleteBranchTranslationByBranchId,
}
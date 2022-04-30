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
        console.log("knowledgebase databse initialization failed!!!");
    }else{
        console.log("knowledgebase databse initialized successfully!!!");
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

const createUser = (values, response) => {
    client.query('INSERT INTO users(identity_id, email, password) VALUES($1, $2, $3) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 32821932
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const createGroup = (values, response) => {
    client.query('INSERT INTO groups(name, active, note, type) VALUES($1, $2, $3, $4) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 3282932
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const getGroupByGroupName = (name, response) => {
    pool.query(`SELECT * from groups WHERE name LIKE '%${name}%'`, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 8293458211
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createGroupsUsers = (values, response) => {
    client.query('INSERT INTO groups_users(user_id, group_id, access) VALUES($1, $2, $3) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 3282932
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
    createUser,
    createGroup,
    getGroupByGroupName,
    createGroupsUsers
}
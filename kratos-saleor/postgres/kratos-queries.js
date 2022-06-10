const { Pool, Client } = require('pg');
const { db } = require('../libs/consts');

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.log("KratosSaleor database initialization failed!!!");
    } else {
        console.log("KratosSaleor database initialized successfully!!!");
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


const getUserByEmail = (values, response) => {
    pool.query(`SELECT * from ${db.account_user} WHERE email=$1`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getUserById = (values, response) => {
    pool.query(`SELECT * from ${db.account_user} WHERE id=$1`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getUserByIsStaff = (values, response) => {
    pool.query(`SELECT * from ${db.account_user} WHERE is_staff=$1`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getAccountUserAddressesByUserId = (values, response) => {
    pool.query(`SELECT * from ${db.account_user_addresses} WHERE user_id=$1`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getAccountAddressById = (values, response) => {
    pool.query(`SELECT * from ${db.account_address} WHERE id=$1`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createAccountUser = (values, response) => {
    client.query(`INSERT INTO ${db.account_user} (is_superuser, email, is_staff, is_active, password, date_joined, last_login, default_billing_address_id, default_shipping_address_id, note, first_name, last_name, avatar, private_metadata, metadata, jwt_token_key, language_code, search_document, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createAccountAddress = (values, response) => {
    client.query(`INSERT INTO ${db.account_address} (first_name, last_name, company_name, street_address_1, street_address_2, city, postal_code, country, country_area, phone, city_area) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createAccountUserAddress = (values, response) => {
    client.query(`INSERT INTO ${db.account_user_addresses} (user_id, address_id) VALUES($1, $2) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateAccountAddressById = (values, whereClause, response) => {
    let query = `UPDATE ${db.account_address} SET ${whereClause} WHERE id=$1 RETURNING *`;
    console.log(query);
    client.query(query, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 229
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateAccountUserActive = (values, response) => {
    client.query(`UPDATE ${db.account_user} SET is_active=$2 WHERE id=$1 RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 229
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateAccountUserJWTTokenKey = (values, response) => {
    client.query(`UPDATE ${db.account_user} SET jwt_token_key=$2 WHERE id=$1 RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 229
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateAccountUserPassword = (values, response) => {
    client.query(`UPDATE ${db.account_user} SET password=$2 WHERE id=$1 RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 229
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateAccountUserEmail = (values, response) => {
    client.query(`UPDATE ${db.account_user} SET email=$2 WHERE id=$1 RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 229
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};


const deleteAccountUserById = (values, response) => {
    client.query(`DELETE FROM ${db.account_user} WHERE id=$1`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteAccountAddressById = (values, response) => {
    client.query(`DELETE FROM ${db.account_address} WHERE id=$1`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteAccountUserAddressesByUserId = (values, response) => {
    client.query(`DELETE FROM ${db.account_user_addresses} WHERE user_id=$1`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

module.exports = {
    getUserByEmail,
    getUserById,
    getUserByIsStaff,
    getAccountUserAddressesByUserId,
    getAccountAddressById,

    createAccountUser,
    createAccountAddress,
    createAccountUserAddress,

    updateAccountUserActive,
    updateAccountUserJWTTokenKey,
    updateAccountUserPassword,
    updateAccountUserEmail,
    updateAccountAddressById,

    deleteAccountUserById,
    deleteAccountAddressById,
    deleteAccountUserAddressesByUserId
}
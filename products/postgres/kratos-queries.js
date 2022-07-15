const { Pool, Client } = require('pg');
const { db } = require('../libs/consts');

const pool = new Pool({
    user: process.env.POSTGRES_USER_USER,
    host: process.env.POSTGRES_USER_HOST,
    database: process.env.POSTGRES_USER_DB,
    password: process.env.POSTGRES_USER_PASSWORD,
    port: process.env.POSTGRES_USER_PORT
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.log(`${process.env.POSTGRES_USER_DB} database initialization failed!!!`);
    } else {
        console.log(`${process.env.POSTGRES_USER_DB} database initialized successfully!!!`);
    }
});

const client = new Client({
    user: process.env.POSTGRES_USER_USER,
    host: process.env.POSTGRES_USER_HOST,
    database: process.env.POSTGRES_USER_DB,
    password: process.env.POSTGRES_USER_PASSWORD,
    port: process.env.POSTGRES_USER_PORT
});
client.connect();

const stop = () => {
    return new Promise(resolve => {
        client.end().then(() => {
            console.log(`${process.env.POSTGRES_USER_DB} database disconnection successful!!!`);
            resolve();
        }).catch(err => {
            console.log(`${process.env.POSTGRES_USER_DB} database disconnection failed!!!`);
            console.log(err);
            resolve();
        });
    });
};

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

const getAccountUserAddressesByAddressId = (values, response) => {
    pool.query(`SELECT * from ${db.account_user_addresses} WHERE address_id=$1`, values, (err, res) => {
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

const getChannel = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.channel_channel} WHERE ${whereClause}`, values, (err, res) => {
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

const getAccountAddress = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.account_address} WHERE ${whereClause}`, values, (err, res) => {
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


const getApp = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.app_app} WHERE ${whereClause}`, values, (err, res) => {
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

const updateAccountUserById = (values, whereClause, response) => {
    client.query(`UPDATE ${db.account_user} SET ${whereClause} WHERE id=$1 RETURNING *`, values, (err, res) => {
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

const updateAccountAddressById = (values, whereClause, response) => {
    client.query(`UPDATE ${db.account_address} SET ${whereClause} WHERE id=$1 RETURNING *`, values, (err, res) => {
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

const deleteAccountUserAddressesByUserIdAndAddressId = (values, response) => {
    client.query(`DELETE FROM ${db.account_user_addresses} WHERE user_id=$1 AND address_id=$2`, values, (err, res) => {
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
    stop,

    getUserByEmail,
    getUserById,
    getUserByIsStaff,
    getAccountUserAddressesByUserId,
    getAccountUserAddressesByAddressId,
    getAccountAddressById,
    getChannel,
    getAccountAddress,
    getApp,

    createAccountUser,
    createAccountAddress,
    createAccountUserAddress,

    updateAccountUserById,
    updateAccountUserActive,
    updateAccountUserJWTTokenKey,
    updateAccountUserPassword,
    updateAccountUserEmail,
    updateAccountAddressById,

    deleteAccountUserById,
    deleteAccountAddressById,
    deleteAccountUserAddressesByUserId,
    deleteAccountUserAddressesByUserIdAndAddressId
}
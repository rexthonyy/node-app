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


const getShiftGroupById = (values, response) => {
    pool.query(`SELECT * from ${db.shift_groups} WHERE id=$1`, values, (err, res) => {
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

const getShiftGroupsByChannelId = (values, response) => {
    pool.query(`SELECT * from ${db.shift_groups} WHERE channel_id=$1`, values, (err, res) => {
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

const getShiftGroupMemberByUserId = (values, response) => {
    pool.query(`SELECT * from ${db.shift_group_members} WHERE user_id=$1`, values, (err, res) => {
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


const createShiftGroup = (values, response) => {
    client.query(`INSERT INTO ${db.shift_groups} (channel_id, name, position) VALUES($1, $2, $3) RETURNING *`, values, (err, res) => {
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

const createShiftGroupMember = (values, response) => {
    client.query(`INSERT INTO ${db.shift_group_members} (channel_id, shift_group_id, user_id, position) VALUES($1, $2, $3, $4) RETURNING *`, values, (err, res) => {
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


const updateShiftGroupById = (values, whereClause, response) => {
    client.query(`UPDATE ${db.shift_groups} SET ${whereClause} WHERE id=$1 RETURNING *`, values, (err, res) => {
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


const deleteAssignedShiftActivitiesByShiftGroupId = (values, response) => {
    client.query(`DELETE FROM ${db.assigned_shift_activities} WHERE shift_group_id=$1`, values, (err, res) => {
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

const deleteOpenShiftActivitiesByShiftGroupId = (values, response) => {
    client.query(`DELETE FROM ${db.open_shift_activities} WHERE shift_group_id=$1`, values, (err, res) => {
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

const deleteUserTimeOffsByShiftGroupId = (values, response) => {
    client.query(`DELETE FROM ${db.user_time_offs} WHERE shift_group_id=$1`, values, (err, res) => {
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

const deleteAssignedShiftsByShiftGroupId = (values, response) => {
    client.query(`DELETE FROM ${db.assigned_shifts} WHERE shift_group_id=$1`, values, (err, res) => {
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

const deleteOpenShiftsByShiftGroupId = (values, response) => {
    client.query(`DELETE FROM ${db.open_shifts} WHERE shift_group_id=$1`, values, (err, res) => {
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

const deleteShiftGroupMembersByShiftGroupId = (values, response) => {
    client.query(`DELETE FROM ${db.shift_group_members} WHERE shift_group_id=$1`, values, (err, res) => {
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

const deleteShiftGroupById = (values, response) => {
    client.query(`DELETE FROM ${db.shift_groups} WHERE id=$1`, values, (err, res) => {
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
    getShiftGroupById,
    getShiftGroupsByChannelId,
    getShiftGroupMemberByUserId,

    createShiftGroup,
    createShiftGroupMember,

    updateShiftGroupById,



    createAccountAddress,
    createAccountUserAddress,

    updateAccountUserActive,
    updateAccountUserJWTTokenKey,
    updateAccountUserPassword,
    updateAccountUserEmail,
    updateAccountAddressById,

    deleteAssignedShiftActivitiesByShiftGroupId,
    deleteOpenShiftActivitiesByShiftGroupId,
    deleteUserTimeOffsByShiftGroupId,
    deleteAssignedShiftsByShiftGroupId,
    deleteOpenShiftsByShiftGroupId,
    deleteShiftGroupMembersByShiftGroupId,
    deleteShiftGroupById
}
const { Pool, Client } = require('pg');
const { db } = require('../libs/consts');

const pool = new Pool({
    user: process.env.POSTGRES_PERMISSIONS_USER,
    host: process.env.POSTGRES_PERMISSIONS_HOST,
    database: process.env.POSTGRES_PERMISSIONS_DB,
    password: process.env.POSTGRES_PERMISSIONS_PASSWORD,
    port: process.env.POSTGRES_PERMISSIONS_PORT
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.log(`${process.env.POSTGRES_PERMISSIONS_DB} database initialization failed!!!`);
    } else {
        console.log(`${process.env.POSTGRES_PERMISSIONS_DB} database initialized successfully!!!`);
    }
});

const client = new Client({
    user: process.env.POSTGRES_PERMISSIONS_USER,
    host: process.env.POSTGRES_PERMISSIONS_HOST,
    database: process.env.POSTGRES_PERMISSIONS_DB,
    password: process.env.POSTGRES_PERMISSIONS_PASSWORD,
    port: process.env.POSTGRES_PERMISSIONS_PORT
});
client.connect();


const getAuthGroups = (response) => {
    pool.query(`SELECT * from ${db.auth_group}`, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                test: 88
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getAuthGroupById = (values, response) => {
    pool.query(`SELECT * from ${db.auth_group} WHERE id=$1`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                test: 88
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createAuthGroup = (values, response) => {
    client.query(`INSERT INTO ${db.auth_group} (name) VALUES($1) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 2
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const getAuthPermissionsByCodename = (whereClause, values, response) => {
    pool.query(`SELECT * from ${db.auth_permissions} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                test: 4
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createAuthGroupPermission = (values, response) => {
    client.query(`INSERT INTO ${db.auth_group_permissions} (group_id, permission_id) VALUES($1, $2) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 5
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const createAccountUserPermission = (values, response) => {
    client.query(`INSERT INTO ${db.account_user_user_permissions} (user_id, permission_id) VALUES($1, $2) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 5
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const createAccountUserGroup = (values, response) => {
    client.query(`INSERT INTO ${db.account_user_groups} (user_id, group_id) VALUES($1, $2) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 5
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const getAuthGroupPermissionsByGroupId = (values, response) => {
    pool.query(`SELECT * from ${db.auth_group_permissions} WHERE group_id=$1`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                test: 88
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getAuthPermissionById = (values, response) => {
    pool.query(`SELECT * from ${db.auth_permissions} WHERE id=$1`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                test: 88
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getAccountUserGroupsByGroupId = (values, response) => {
    pool.query(`SELECT * from ${db.account_user_groups} WHERE group_id=$1`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                test: 88
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getAccountUserGroupsByUserId = (values, response) => {
    pool.query(`SELECT * from ${db.account_user_groups} WHERE user_id=$1`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                test: 88
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getAccountUserPermissionsByUserId = (values, response) => {
    pool.query(`SELECT * from ${db.account_user_user_permissions} WHERE user_id=$1`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                test: 88
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteAccountUserPermissionsByUserId = (values, response) => {
    client.query(`DELETE FROM ${db.account_user_user_permissions} WHERE user_id=$1`, values, (err, res) => {
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

const deleteAuthGroupPermissionsByPermissionsId = (values, response) => {
    client.query(`DELETE FROM ${db.auth_group_permissions} WHERE group_id=$1 AND permission_id=$2`, values, (err, res) => {
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

const deleteAccountUserGroupsByUserId = (values, response) => {
    client.query(`DELETE FROM ${db.account_user_groups} WHERE user_id=$1 AND group_id=$2`, values, (err, res) => {
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

const deleteAuthGroupPermissionsByGroupId = (values, response) => {
    client.query(`DELETE FROM ${db.auth_group_permissions} WHERE group_id=$1`, values, (err, res) => {
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

const deleteAuthGroupById = (values, response) => {
    client.query(`DELETE FROM ${db.auth_group} WHERE id=$1`, values, (err, res) => {
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

const updateAuthGroupById = (values, response) => {
    client.query(`UPDATE ${db.auth_group} SET name=$2 WHERE id=$1`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 6
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
    getAuthGroups,
    getAuthGroupById,
    createAuthGroup,
    getAuthPermissionsByCodename,
    createAuthGroupPermission,
    createAccountUserPermission,
    createAccountUserGroup,
    getAuthGroupPermissionsByGroupId,
    getAuthPermissionById,
    getAccountUserGroupsByGroupId,
    getAccountUserGroupsByUserId,
    getAccountUserPermissionsByUserId,
    deleteAccountUserPermissionsByUserId,
    deleteAuthGroupPermissionsByPermissionsId,
    deleteAccountUserGroupsByUserId,
    deleteAuthGroupPermissionsByGroupId,
    deleteAuthGroupById,
    updateAuthGroupById,
}
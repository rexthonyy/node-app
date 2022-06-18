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

const getShiftGroupMembersByChannelId = (values, response) => {
    pool.query(`SELECT * from ${db.shift_group_members} WHERE channel_id=$1`, values, (err, res) => {
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

const getShiftGroupMembersByChannelIdAndShiftGroupId = (values, response) => {
    pool.query(`SELECT * from ${db.shift_group_members} WHERE channel_id=$1 AND shift_group_id=$2`, values, (err, res) => {
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

const getAssignedShiftsByChannelIdShiftGroupIdAndUserId = (values, response) => {
    pool.query(`SELECT * from ${db.assigned_shifts} WHERE channel_id=$1 AND shift_group_id=$2 AND user_id=$3`, values, (err, res) => {
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

const getOpenShifts = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.open_shifts} WHERE ${whereClause}`, values, (err, res) => {
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

const getAssignedShifts = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.assigned_shifts} WHERE ${whereClause}`, values, (err, res) => {
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

const getUserTimeOffs = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.user_time_offs} WHERE ${whereClause}`, values, (err, res) => {
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

const getRequests = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.requests} WHERE ${whereClause}`, values, (err, res) => {
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

const getRequestTimeOff = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.request_time_off} WHERE ${whereClause}`, values, (err, res) => {
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

const getRequestOffer = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.request_offer} WHERE ${whereClause}`, values, (err, res) => {
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

const getRequestSwap = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.request_swap} WHERE ${whereClause}`, values, (err, res) => {
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

const updateShiftGroupMembersByChannelIdShiftGroupIdAndUserId = (values, whereClause, response) => {
    client.query(`UPDATE ${db.shift_group_members} SET ${whereClause} WHERE channel_id=$1 AND shift_group_id=$2 AND user_id=$3 RETURNING *`, values, (err, res) => {
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

const deleteAssignedShiftActivitiesByChannelIdShiftGroupIdAndUserId = (values, response) => {
    client.query(`DELETE FROM ${db.assigned_shift_activities} WHERE channel_id=$1 AND shift_group_id=$2 AND user_id=$3`, values, (err, res) => {
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

const deleteUserTimeOffsByChannelIdShiftGroupIdAndUserId = (values, response) => {
    client.query(`DELETE FROM ${db.user_time_offs} WHERE channel_id=$1 AND shift_group_id=$2 AND user_id=$3`, values, (err, res) => {
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

const deleteAssignedShiftsByChannelIdShiftGroupIdAndUserId = (values, response) => {
    client.query(`DELETE FROM ${db.assigned_shifts} WHERE channel_id=$1 AND shift_group_id=$2 AND user_id=$3`, values, (err, res) => {
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

const deleteShiftGroupMembersByChannelIdShiftGroupIdAndUserId = (values, response) => {
    client.query(`DELETE FROM ${db.shift_group_members} WHERE channel_id=$1 AND shift_group_id=$2 AND user_id=$3`, values, (err, res) => {
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
    getShiftGroupMembersByChannelId,
    getShiftGroupMembersByChannelIdAndShiftGroupId,
    getAssignedShiftsByChannelIdShiftGroupIdAndUserId,
    getOpenShifts,
    getAssignedShifts,
    getUserTimeOffs,
    getRequests,
    getRequestTimeOff,
    getRequestSwap,
    getRequestOffer,

    createShiftGroup,
    createShiftGroupMember,

    updateShiftGroupById,
    updateShiftGroupMembersByChannelIdShiftGroupIdAndUserId,

    deleteAssignedShiftActivitiesByShiftGroupId,
    deleteAssignedShiftActivitiesByChannelIdShiftGroupIdAndUserId,
    deleteOpenShiftActivitiesByShiftGroupId,
    deleteUserTimeOffsByShiftGroupId,
    deleteUserTimeOffsByChannelIdShiftGroupIdAndUserId,
    deleteAssignedShiftsByShiftGroupId,
    deleteAssignedShiftsByChannelIdShiftGroupIdAndUserId,
    deleteOpenShiftsByShiftGroupId,
    deleteShiftGroupMembersByShiftGroupId,
    deleteShiftGroupMembersByChannelIdShiftGroupIdAndUserId,
    deleteShiftGroupById
}
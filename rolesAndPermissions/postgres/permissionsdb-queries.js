const { Pool, Client } = require('pg');
const { db } = require('../lib/consts');

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.log(`${process.env.POSTGRES_DB} databse (ticket queries) initialization failed!!!`);
    } else {
        console.log(`${process.env.POSTGRES_DB} databse (ticket queries) initialized successfully!!!`);
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

const deleteTicketTimeAccounting = (values, response) => {
    client.query('DELETE FROM ticket_time_accountings WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 7
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const getTicketStateByName = (name, response) => {
    pool.query(`SELECT * from ticket_states WHERE name ILIKE '%${name}%'`, (err, res) => {
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

const getTicketStates = (res_, response) => {
    pool.query("SELECT * from ticket_states", (err, res) => {
        if (err) {
            response(res_, {
                err: err,
                res: null,
                test: 8
            });
        } else {
            response(res_, {
                err: null,
                res: res.rows
            });
        }
    });
};

const createTicketState = (res_, values, response) => {
    client.query('INSERT INTO ticket_states (state_type_id, name, next_state_id, ignore_escalation, default_create, default_follow_up, note, active, updated_by_id, created_by_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *', values, (err, res) => {
        if (err) {
            response(res_, {
                err: err.stack,
                res: null,
                test: 9
            });
        } else {
            response(res_, {
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateTicketState = (values, response) => {
    client.query('UPDATE ticket_states SET state_type_id=$2, name=$3, next_state_id=$4, ignore_escalation=$5, default_create=$6, default_follow_up=$7, note=$8, active=$9, updated_by_id=$10, created_by_id=$11, created_at=$12, updated_at=$13 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 10
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteTicketState = (values, response) => {
    client.query('DELETE FROM ticket_states WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 11
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};


const getTicketStateTypes = (res_, response) => {
    pool.query("SELECT * from ticket_state_types", (err, res) => {
        if (err) {
            response(res_, {
                err: err,
                res: null,
                test: 12
            });
        } else {
            response(res_, {
                err: null,
                res: res.rows
            });
        }
    });
};

const createTicketStateType = (res_, values, response) => {
    client.query('INSERT INTO ticket_state_types (name, note, updated_by_id, created_by_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING *', values, (err, res) => {
        if (err) {
            response(res_, {
                err: err.stack,
                res: null,
                test: 12
            });
        } else {
            response(res_, {
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateTicketStateType = (values, response) => {
    client.query('UPDATE ticket_state_types SET name=$2, note=$3, updated_by_id=$4, created_by_id=$5, created_at=$6, updated_at=$7 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 13
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteTicketStateType = (values, response) => {
    client.query('DELETE FROM ticket_state_types WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 14
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};




const getTicketPrioritiesById = (id, response) => {
    pool.query(`SELECT * from ticket_priorities WHERE id=${id}`, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                test: 40
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getTicketPriorityByName = (name, response) => {
    pool.query(`SELECT * from ticket_priorities WHERE name ILIKE '%${name}%'`, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                test: 40
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getTicketPriorities = (res_, response) => {
    pool.query("SELECT * from ticket_priorities", (err, res) => {
        if (err) {
            response(res_, {
                err: err,
                res: null,
                test: 15
            });
        } else {
            response(res_, {
                err: null,
                res: res.rows
            });
        }
    });
};

const createTicketPriorities = (res_, values, response) => {
    client.query('INSERT INTO ticket_priorities (name, default_create, ui_icon, ui_color, note, active, updated_by_id, created_by_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *', values, (err, res) => {
        if (err) {
            response(res_, {
                err: err.stack,
                res: null,
                test: 16
            });
        } else {
            response(res_, {
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateTicketPriorities = (values, response) => {
    client.query('UPDATE ticket_priorities SET name=$2, default_create=$3, ui_icon=$4, ui_color=$5, note=$6, active=$7, updated_by_id=$8, created_by_id=$9, created_at=$10, updated_at=$11 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 16
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteTicketPriorities = (values, response) => {
    client.query('DELETE FROM ticket_priorities WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 17
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const getTicketFlags = (res_, response) => {
    pool.query("SELECT * from ticket_flags", (err, res) => {
        if (err) {
            response(res_, {
                err: err,
                res: null,
                test: 18
            });
        } else {
            response(res_, {
                err: null,
                res: res.rows
            });
        }
    });
};

const createTicketFlag = (res_, values, response) => {
    client.query('INSERT INTO ticket_flags (name, ticket_id, key, value, created_by_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING *', values, (err, res) => {
        if (err) {
            response(res_, {
                err: err.stack,
                res: null,
                test: 19
            });
        } else {
            response(res_, {
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateTicketFlag = (values, response) => {
    client.query('UPDATE ticket_flags SET ticket_id=$2, key=$3, value=$4, created_by_id=$5, created_at=$6, updated_at=$7 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 21
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteTicketFlag = (values, response) => {
    client.query('DELETE FROM ticket_flags WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 22
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};


const getTicketCounters = (res_, response) => {
    pool.query("SELECT * from ticket_counters", (err, res) => {
        if (err) {
            response(res_, {
                err: err,
                res: null,
                test: 23
            });
        } else {
            response(res_, {
                err: null,
                res: res.rows
            });
        }
    });
};

const createTicketCounter = (res_, values, response) => {
    client.query('INSERT INTO ticket_counters (content, generator) VALUES($1, $2) RETURNING *', values, (err, res) => {
        if (err) {
            response(res_, {
                err: err.stack,
                res: null,
                test: 24
            });
        } else {
            response(res_, {
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateTicketCounter = (values, response) => {
    client.query('UPDATE ticket_counters SET content=$2, generator=$3 WHERE id=$1', values, (err, res) => {
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

const deleteTicketCounter = (values, response) => {
    client.query('DELETE FROM ticket_counters WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 28
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const getTicketArticlesByTicketId = (ticket_id, response) => {
    pool.query(`SELECT * from ticket_articles WHERE ticket_id=${ticket_id}`, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                test: 37
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getTicketArticlesByArticleId = (article_id, response) => {
    pool.query(`SELECT * from ticket_articles WHERE id=${article_id}`, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                test: 37
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getTicketArticles = (res_, response) => {
    pool.query("SELECT * from ticket_articles", (err, res) => {
        if (err) {
            response(res_, {
                err: err,
                res: null,
                test: 30
            });
        } else {
            response(res_, {
                err: null,
                res: res.rows
            });
        }
    });
};

const createTicketArticle = (res_, values, response) => {
    client.query('INSERT INTO ticket_articles (ticket_id, type_id, sender_id, from_, to_, cc, subject, reply_to, message_id, message_id_md5, in_reply_to, content_type, references_, body, internal, preferences, updated_by_id, created_by_id, origin_by_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING *', values, (err, res) => {
        if (err) {
            response(res_, {
                err: err.stack,
                res: null,
                test: 24
            });
        } else {
            response(res_, {
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateTicketArticle = (values, response) => {
    client.query('UPDATE ticket_articles SET ticket_id=$2, type_id=$3, sender_id=$4, from_=$5, to_=$6, cc=$7, subject=$8, reply_to=$9, message_id=$10, message_id_md5=$11, in_reply_to=$12, content_type=$13, references_=$14, body=$15, internal=$16, preferences=$17, updated_by_id=$18, created_by_id=$19, origin_by_id=$20, created_at=$21, updated_at=$22 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 28
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteTicketArticle = (values, response) => {
    client.query('DELETE FROM ticket_articles WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 30
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteTicketArticleByTicketId = (values, response) => {
    client.query('DELETE FROM ticket_articles WHERE ticket_id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 32
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};


const getTicketArticleTypes = (res_, response) => {
    pool.query("SELECT * from ticket_article_types", (err, res) => {
        if (err) {
            response(res_, {
                err: err,
                res: null,
                test: 32
            });
        } else {
            response(res_, {
                err: null,
                res: res.rows
            });
        }
    });
};

const createTicketArticleType = (res_, values, response) => {
    client.query('INSERT INTO ticket_article_types (name, note, communication, active, updated_by_id, created_by_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', values, (err, res) => {
        if (err) {
            response(res_, {
                err: err.stack,
                res: null,
                test: 34
            });
        } else {
            response(res_, {
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateTicketArticleType = (values, response) => {
    client.query('UPDATE ticket_article_types SET name=$2, note=$3, communication=$4, active=$5, updated_by_id=$6, created_by_id=$7, created_at=$8, updated_at=$9 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 36
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteTicketArticleType = (values, response) => {
    client.query('DELETE FROM ticket_article_types WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 38
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};


const getTicketArticleSenders = (res_, response) => {
    pool.query("SELECT * from ticket_article_senders", (err, res) => {
        if (err) {
            response(res_, {
                err: err,
                res: null,
                test: 40
            });
        } else {
            response(res_, {
                err: null,
                res: res.rows
            });
        }
    });
};

const createTicketArticleSender = (res_, values, response) => {
    client.query('INSERT INTO ticket_article_sender (name, note, updated_by_id, created_by_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING *', values, (err, res) => {
        if (err) {
            response(res_, {
                err: err.stack,
                res: null,
                test: 43
            });
        } else {
            response(res_, {
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateTicketArticleSender = (values, response) => {
    client.query('UPDATE ticket_article_sender SET name=$2, note=$3, updated_by_id=$4, created_by_id=$5, created_at=$6, updated_at=$7 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 45
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteTicketArticleSender = (values, response) => {
    client.query('DELETE FROM ticket_article_sender WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 41
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};


const getTicketArticleFlags = (res_, response) => {
    pool.query("SELECT * from ticket_article_flags", (err, res) => {
        if (err) {
            response(res_, {
                err: err,
                res: null,
                test: 43
            });
        } else {
            response(res_, {
                err: null,
                res: res.rows
            });
        }
    });
};

const createTicketArticleFlag = (res_, values, response) => {
    client.query('INSERT INTO ticket_article_flags (ticket_article_id, key, value, created_by_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING *', values, (err, res) => {
        if (err) {
            response(res_, {
                err: err.stack,
                res: null,
                test: 46
            });
        } else {
            response(res_, {
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateTicketArticleFlag = (values, response) => {
    client.query('UPDATE ticket_article_flags SET ticket_article_id=$2, key=$3, value=$4, created_by_id=$5, created_at=$6, updated_at=$7 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 46
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteTicketArticleFlag = (values, response) => {
    client.query('DELETE FROM ticket_article_flags WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 47
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};


const searchTickets = (query, response) => {
    pool.query(`SELECT * from tickets WHERE title LIKE '%${query}%'`, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                test: 28
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getTicketById = (ticket_id, response) => {
    pool.query(`SELECT * from tickets WHERE id=${ticket_id}`, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                test: 43
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};



const getMentionsById = (id, response) => {
    pool.query(`SELECT * from mentions WHERE id=${id}`, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                test: 422
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getMentions = response => {
    pool.query("SELECT * from mentions", (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                test: 421
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createMentions = (res_, values, response) => {
    client.query('INSERT INTO mentions (mentionable_type, mentionable_id, user_id, updated_by_id, created_by_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *', values, (err, res) => {
        if (err) {
            response(res_, {
                err: err.stack,
                res: null,
                test: 22
            });
        } else {
            response(res_, {
                err: null,
                res: res.rows[0]
            });
        }
    });
};



const getTagObjectsByName = (values, response) => {
    pool.query("SELECT * from tag_objects WHERE name=$1", values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                test: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getTagItemById = (values, response) => {
    pool.query("SELECT * from tag_items WHERE id=$1", values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                test: 202
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getTagItemByName = (values, response) => {
    pool.query("SELECT * from tag_items WHERE name_downcase=$1", values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                test: 202
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createTagItem = (values, response) => {
    client.query('INSERT INTO tag_items (name, name_downcase, created_at, updated_at) VALUES($1, $2, $3, $4) RETURNING *', values, (err, res) => {
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

const createTagObject = (values, response) => {
    client.query('INSERT INTO tag_objects (name, created_at, updated_at) VALUES($1, $2, $3) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: "32ds"
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const searchTagItems = (query, response) => {
    pool.query(`SELECT * from tag_items WHERE LIKE '%${query}%'`, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                test: 121
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getTagsByO_id = (values, response) => {
    pool.query("SELECT * from tags WHERE tag_item_id=$1, tag_object_id=$2, o_id=$3", values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                test: 75
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteTagsByO_id = (values, response) => {
    client.query('DELETE FROM tags WHERE tag_item_id=$1, tag_object_id=$2, o_id=$3', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 471
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
    updateAuthGroupById,
}
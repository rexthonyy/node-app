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
        console.log("Forums database initialization failed!!!");
    }else{
        console.log("Forums database initialized successfully!!!");
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

const updateForumTopicUpdateSchedule = (values, response) => {
    client.query('UPDATE topics SET is_update_scheduled=$2 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 239
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateForumTopicDeleteSchedule = (values, response) => {
    client.query('UPDATE topics SET is_delete_scheduled=$2 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 239
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateForumPostUpdateSchedule = (values, response) => {
    client.query('UPDATE posts SET is_update_scheduled=$2 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 239
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateForumPostDeleteSchedule = (values, response) => {
    client.query('UPDATE posts SET is_delete_scheduled=$2 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 239
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const getForums = response => {
    pool.query("SELECT * from forums", (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                tes: 8293
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createForum = (res_, cb, values, response) => {
    client.query('INSERT INTO forums (name, description, topics_count, last_post_date, last_post_id, private, created_at, updated_at, allow_topic_voting, allow_post_voting, layout) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *', values, (err, res) => {
        if (err) {
            response(res_, cb, {
                err: err.stack,
                res: null
            });
        } else {
            response(res_, cb, {
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateForum = (values, response) => {
    client.query('UPDATE forums SET name=$2, description=$3, topics_count=$4, last_post_date=$5, last_post_id=$6, private=$7, created_at=$8, updated_at=$9, allow_topic_voting=$10, allow_post_voting=$11, layout=$12 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 134
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteForum = (data, response) => {
    const values = [data.id];
    client.query('DELETE FROM forums WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 1
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};


const getTopics = (res_, response) => {
    pool.query("SELECT * from topics", (err, res) => {
        if(err){
            response(res_, {
                err: err,
                res: null,
                test: 2
            });
        }else{
            response(res_, {
                err: null,
                res: res.rows
            });
        }
    });
};

const createTopic = (res_, values, response) => {
    client.query('INSERT INTO topics (forum_id, user_id, subject, message, points, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *', values, (err, res) => {
        if (err) {
            response(res_, {
                err: err.stack,
                res: null
            });
        } else {
            response(res_, {
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateTopic = (values, response) => {
    client.query('UPDATE topics SET forum_id=$2, user_id=$3, subject=$4, message=$5, points=$6, created_at=$7, updated_at=$8 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 3
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteTopic = (data, response) => {
    const values = [data.id];
    client.query('DELETE FROM topics WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 4
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};



const getPosts = (res_, response) => {
    pool.query("SELECT * from posts", (err, res) => {
        if(err){
            response(res_, {
                err: err,
                res: null,
                test: 5
            });
        }else{
            response(res_, {
                err: null,
                res: res.rows
            });
        }
    });
};

const createPost = (values, res_, cb, response) => {
    client.query('INSERT INTO posts (topic_id, user_id, body, kind, active, created_at, updated_at, points, attachements, cc, bcc, raw_email, email_to_address) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *', values, (err, res) => {
        if (err) {
            response(res_, cb, {
                err: err.stack,
                res: null,
                test: 6
            });
        } else {
            response(res_, cb, {
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updatePost = (data, response) => {
    const values = [data.id, data.topic_id, data.user_id, data.body, data.kind, data.active, data.created_at, data.updated_at, data.points, data.attachments, data.cc, data.bcc, data.raw_email, data.email_to_address];
    client.query('UPDATE posts SET topic_id=$2, user_id=$3, body=$4, kind=$5, active=$6, created_at=$7, updated_at=$8, points=$9, attachements=$10, cc=$11, bcc=$12, raw_email=$13, email_to_address=$14 WHERE id=$1', values, (err, res) => {
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

const deletePost = (data, response) => {
    const values = [data.id];
    client.query('DELETE FROM posts WHERE id=$1', values, (err, res) => {
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



const getFlags = (res_, response) => {
    pool.query("SELECT * from flags", (err, res) => {
        if(err){
            response(res_, {
                err: err,
                res: null,
                test: 9
            });
        }else{
            response(res_, {
                err: null,
                res: res.rows
            });
        }
    });
};

const createFlag = (res_, values, response) => {
    client.query('INSERT INTO flags (post_id, generated_topic_id, reason, created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING *', values, (err, res) => {
        if (err) {
            response(res_, {
                err: err.stack,
                res: null,
                test: 10
            });
        } else {
            response(res_, {
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateFlag = (data, response) => {
    const values = [data.id, data.post_id, data.generated_topic_id, data.reason, data.created_at, data.updated_at];
    client.query('UPDATE flags SET post_id=$2, generated_topic_id=$3, reason=$4, created_at=$5, updated_at=$6 WHERE id=$1', values, (err, res) => {
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

const deleteFlag = (data, response) => {
    const values = [data.id];
    client.query('DELETE FROM flags WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 12
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};




const getTags = (res_, cb, response) => {
    pool.query("SELECT * from tags", (err, res) => {
        if(err){
            response(res_, cb, {
                err: err,
                res: null
            });
        }else{
            response(res_, cb, {
                err: null,
                res: res.rows
            });
        }
    });
};

const createTag = (res_, cb, data, response) => {
    const values = [data.name, data.taggings_count, data.show_on_helpcenter, data.show_on_admin, data.show_on_dashboard, data.description, data.color, data.active, data.email_address, data.email_name];
    client.query('INSERT INTO tags (name, taggings_count, show_on_helpcenter, show_on_admin, show_on_dashboard, description, color, active, email_address, email_name) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *', values, (err, res) => {
        if (err) {
            response(res, cb, {
                err: err.stack,
                res: null
            });
        } else {
            response(res, cb, {
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateTag = (data, response) => {
    const values = [data.id, data.name, data.taggings_count, data.show_on_helpcenter, data.show_on_admin, data.show_on_dashboard, data.description, data.color, data.active, data.email_address, data.email_name];
    client.query('UPDATE tags SET name=$2, taggings_count=$3, show_on_helpcenter=$4, show_on_admin=$5, show_on_dashboard=$6, description=$7, color=$8, active=$9, email_address=$10, email_name=$11 WHERE id=$1', values, (err, res) => {
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

const deleteTag = (data, response) => {
    const values = [data.id];
    client.query('DELETE FROM tags WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 15
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};



const getVotes = (res_, response) => {
    pool.query("SELECT * from votes", (err, res) => {
        if(err){
            response(res_, {
                err: err,
                res: null,
                test: 16
            });
        }else{
            response(res_, {
                err: null,
                res: res.rows
            });
        }
    });
};

const createVote = (res_, values, response) => {
    client.query('INSERT INTO votes (points, voteable_type, voteable_id, user_id, user_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING *', values, (err, res) => {
        if (err) {
            response(res_, {
                err: err.stack,
                res: null,
                test: 18
            });
        } else {
            response(res_, {
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateVote = (data, response) => {
    const values = [data.id, data.points, data.voteable_type, data.voteable_id, data.user_id, data.created_at, data.updated_at];
    client.query('UPDATE votes SET points=$2, voteable_type=$3, voteable_id=$4, user_id=$5, created_at=$6, updated_at=$7 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 19
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteVote = (data, response) => {
    const values = [data.id];
    client.query('DELETE FROM votes WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 20
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};



const getForumsById = (forum_id, response) => {
    pool.query(`SELECT * from forums WHERE id=${forum_id}`, (err, res) => {
        if(err){
            response({
                err: err,
                res: null
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getTopicsByForumId = (forum_id, response) => {
    pool.query(`SELECT * from topics WHERE forum_id=${forum_id}`, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                test: 21
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getPostsByTopicId = (topic_id, response) => {
    pool.query(`SELECT * from posts WHERE topic_id=${topic_id}`, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                test: 22
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};


const getTopicsById = (topic_id, response) => {
    pool.query(`SELECT * from topics WHERE id=${topic_id}`, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                test: 23
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getTopicPoints = (topic_id, response) => {
    pool.query(`SELECT points from topics WHERE id=${topic_id}`, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                test: 24
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateTopicPoints = (topic_id, point, response) => {
    client.query('UPDATE topics SET points=$2 WHERE id=$1', [topic_id, point], (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 25
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const getPostById = (res_, post_id, response) => {
    pool.query(`SELECT * from posts WHERE id=${post_id}`, (err, res) => {
        if(err){
            response(res_, {
                err: err,
                res: null,
                test: 26
            });
        }else{
            response(res_, {
                err: null,
                res: res.rows
            });
        }
    });
};

const getTagById = (res_, tag_id, response) => {
    pool.query(`SELECT * from tags WHERE id=${tag_id}`, (err, res) => {
        if(err){
            response(res_, {
                err: err,
                res: null,
                test: 27
            });
        }else{
            response(res_, {
                err: null,
                res: res.rows
            });
        }
    });
};

const searchTopics = (query, response) => {
    pool.query(`SELECT * from topics WHERE subject ILIKE '%${query}%' OR message ILIKE '%${query}%'`, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                test: 28
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createForumPostDelayedJob = (values, response) => {
    client.query('INSERT INTO posts_delayed_jobs (post_id, publish_update_delete, metadata, run_at) VALUES($1, $2, $3, $4) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const createForumTopicDelayedJob = (values, response) => {
    client.query('INSERT INTO topics_delayed_jobs (topic_id, publish_update_delete, metadata, run_at) VALUES($1, $2, $3, $4) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null
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
    getForums,
    createForum,
    updateForum,
    deleteForum,

    getTopics,
    createTopic,
    updateTopic,
    deleteTopic,

    getPosts,
    createPost,
    updatePost,
    deletePost,

    getFlags,
    createFlag,
    updateFlag,
    deleteFlag,

    getTags,
    createTag,
    updateTag,
    deleteTag,

    getVotes,
    createVote,
    updateVote,
    deleteVote,

    getForumsById,
    getTopicsByForumId,
    getPostsByTopicId,

    getTopicsById,
    getTopicPoints,
    updateTopicPoints,
    getPostById,
    getTagById,

    searchTopics,
    updateForumPostUpdateSchedule,
    updateForumPostDeleteSchedule,
    createForumPostDelayedJob,

    updateForumTopicDeleteSchedule,
    updateForumTopicUpdateSchedule,
    createForumTopicDelayedJob
}
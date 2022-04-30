const { Pool, Client } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'reviews',
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
});

pool.query('SELECT NOW()', (err, res) => {
    if(err){
        console.log("reviews app databse initialization failed!!!");
    }else{
        console.log("reviews app databse initialized successfully!!!");
    }
});

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'reviews',
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
});
client.connect();


const createReview = (values, response) => {
    client.query('INSERT INTO task_reviews(task_id, job_id, buyer_id, seller_id, reviewed_by_user_type, title, message, rating, created_at, updated_at, is_published) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *', values, (err, res) => {
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

const updateReview = (values, response) => {
    client.query('UPDATE task_reviews SET task_id=$2, job_id=$3, buyer_id=$4, seller_id=$5, reviewed_by_user_type=$6, title=$7, message=$8, rating=$9, updated_at=$10, is_published=$11 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 74802
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteReview = (values, response) => {
    client.query('DELETE FROM task_reviews WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 11111113
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
    createReview,
    updateReview,
    deleteReview
}
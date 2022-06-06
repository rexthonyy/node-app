const { Pool, Client } = require('pg');

let pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: "postgres",
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT
});

let client = null;

const databaseName = process.env.POSTGRES_DB;

const init = () => {
    return new Promise((resolve, reject) => {
        return resolve();

        createForumsDatabase(() => {
            console.log("Forums database created successfully");
            resolve();
        });
    });
}

function createForumsDatabase(cb) {
    pool.query("CREATE DATABASE $1", [databaseName], (err, res) => {
        if (err) {
            return cb();
        }
        pool.end();

        pool = new Pool({
            user: process.env.POSTGRES_USER,
            host: process.env.POSTGRES_HOST,
            database: databaseName,
            password: process.env.POSTGRES_PASSWORD,
            port: process.env.POSTGRES_PORT
        });

        client = new Client({
            user: process.env.POSTGRES_USER,
            host: process.env.POSTGRES_HOST,
            database: databaseName,
            password: process.env.POSTGRES_PASSWORD,
            port: process.env.POSTGRES_PORT
        });
        client.connect();

        createForumsTB(() => {
            console.log("Done creating forums table");
            createTopicsTB(() => {
                console.log("Done creating topics table");
                createTopicsDelayedJobsTB(() => {
                    console.log("Done creating topics delayed jobs table");
                    createPostsTB(() => {
                        console.log("Done creating posts table");
                        createPostsDelayedJobsTB(() => {
                            console.log("Done creating posts delayed jobs table");
                            createFlagsTB(() => {
                                console.log("Done creating flags table");
                                createTagsTB(() => {
                                    console.log("Done creating tags table");
                                    createVotesTB(() => {
                                        console.log("Done creating votes table");
                                        cb();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

function createForumsTB(cb) {
    let query =
        `CREATE TABLE IF NOT EXISTS forums (
        id serial primary key not null, 
        name varchar,
        description text, 
        topics_count integer not null default 0, 
        last_post_date timestamp without time zone, 
        last_post_id integer, 
        private boolean default false, 
        created_at timestamp without time zone not null default timezone('utc'::text, now()), 
        updated_at timestamp without time zone not null default timezone('utc'::text, now()), 
        allow_topic_voting boolean default false, 
        allow_post_voting boolean default false, 
        layout varchar default 'table'
    )`;
    client.query(query, (err, res) => {
        if (err) {
            console.log(err);
        }
        cb();
    });
}

function createTopicsTB(cb) {
    let query =
        `CREATE TABLE IF NOT EXISTS topics (
        id serial primary key not null, 
        forum_id integer,
        user_id integer,
        subject varchar, 
        points integer,
        message text, 
        created_at timestamp without time zone not null default timezone('utc'::text, now()), 
        updated_at timestamp without time zone not null default timezone('utc'::text, now()),
        is_update_scheduled boolean default false,
        is_delete_scheduled boolean default false
    )`;
    client.query(query, (err, res) => {
        if (err) {
            console.log(err);
        }
        cb();
    });
}

function createTopicsDelayedJobsTB(cb) {
    let query =
        `CREATE TABLE IF NOT EXISTS topics_delayed_jobs (
        id serial primary key not null, 
        topic_id integer,
        publish_update_delete varchar, 
        metadata text,
        run_at timestamp without time zone not null default timezone('utc'::text, now()),
        created_at timestamp without time zone not null default timezone('utc'::text, now())
    )`;
    client.query(query, (err, res) => {
        if (err) {
            console.log(err);
        }
        cb();
    });
}

function createPostsTB(cb) {
    let query =
        `CREATE TABLE IF NOT EXISTS posts (
        id serial primary key not null, 
        topic_id integer,
        user_id integer,
        body text, 
        kind varchar,
        active boolean,
        created_at timestamp without time zone not null, 
        updated_at timestamp without time zone not null,
        points integer, 
        attachements varchar, 
        cc varchar, 
        bcc varchar, 
        raw_email text, 
        email_to_address varchar,
        is_update_scheduled boolean default false,
        is_delete_scheduled boolean default false
    )`;
    client.query(query, (err, res) => {
        if (err) {
            console.log(err);
        }
        cb();
    });
}

function createPostsDelayedJobsTB(cb) {
    let query =
        `CREATE TABLE IF NOT EXISTS posts_delayed_jobs (
        id serial primary key not null, 
        post_id integer,
        publish_update_delete varchar, 
        metadata text,
        run_at timestamp without time zone not null default timezone('utc'::text, now()),
        created_at timestamp without time zone not null default timezone('utc'::text, now())
    )`;
    client.query(query, (err, res) => {
        if (err) {
            console.log(err);
        }
        cb();
    });
}

function createFlagsTB(cb) {
    let query =
        `CREATE TABLE IF NOT EXISTS flags (
        id serial primary key not null, 
        post_id integer,
        generated_topic_id integer,
        reason text,
        created_at timestamp without time zone not null default timezone('utc'::text, now()), 
        updated_at timestamp without time zone not null default timezone('utc'::text, now())
    )`;
    client.query(query, (err, res) => {
        if (err) {
            console.log(err);
        }
        cb();
    });
}

function createTagsTB(cb) {
    let query =
        `CREATE TABLE IF NOT EXISTS tags (
        id serial primary key not null, 
        name varchar,
        taggings_count integer default 0,
        show_on_helpcenter boolean default false,
        show_on_admin boolean default false,
        show_on_dashboard boolean default false,
        description text,
        color varchar,
        active boolean,
        email_address varchar,
        email_name varchar
    )`;
    client.query(query, (err, res) => {
        if (err) {
            console.log(err);
        }
        cb();
    });
}

function createVotesTB(cb) {
    let query =
        `CREATE TABLE IF NOT EXISTS votes (
        id serial primary key not null, 
        points integer default 1,
        voteable_type varchar,
        voteable_id integer,
        user_id integer,
        updated_at timestamp without time zone not null default timezone('utc'::text, now()), 
        created_at timestamp without time zone not null default timezone('utc'::text, now())
    )`;
    client.query(query, (err, res) => {
        if (err) {
            console.log(err);
        }
        cb();
    });
}


module.exports = {
    init
};
const { Pool, Client } = require('pg');
const consts = require("../consts");

let pool = new Pool({
    user: consts.POSTGRES_USER,
    host: consts.POSTGRES_HOST,
    database: "postgres",
    password: consts.POSTGRES_PASS,
    port: consts.POSTGRES_PORT
});

let client = null;

/*
    first create a postgres user called knowledgebase
    second setup the postgres consts variables
    third run the app
*/

const init = () => {
    return new Promise((resolve, reject) => {
        resolve();

        // createKnowledgeBaseDatabase(() => {
        //     console.log("Knowledge base created successfully");
        //     resolve();
        // });
    });
}

function createKnowledgeBaseDatabase(cb){
    pool.query("CREATE DATABASE knowledgebase", (err, res) => {
        if(err){
            //console.log(err);
            return cb();
        }
        pool.end();

        pool = new Pool({
            user: consts.POSTGRES_USER,
            host: consts.POSTGRES_HOST,
            database: "knowledgebase",
            password: consts.POSTGRES_PASSWORD,
            port: consts.POSTGRES_PORT
        });

        client = new Client({
            user: consts.POSTGRES_USER,
            host: consts.POSTGRES_HOST,
            database: "knowledgebase",
            password: consts.POSTGRES_PASSWORD,
            port: consts.POSTGRES_PORT
        });
        client.connect();

        createCalendarsTB(() => {
            console.log("Done creating calender");
            cb();
        });
    });
}

function createCalendarsTB(cb){
    let query = 
    `CREATE TABLE IF NOT EXISTS calendars (
        id serial primary key not null, 
        name varchar,
        timezone varchar, 
        business_hours varchar, 
        default_ boolean not null default false, 
        ical_url varchar, 
        public_holidays text, 
        last_log text, 
        last_sync timestamp without time zone not null, 
        updated_by_id integer not null, 
        created_by_id integer not null, 
        created_at timestamp without time zone not null default timezone('utc'::text, now()), 
        updated_at timestamp without time zone not null default timezone('utc'::text, now())
    )`;
    client.query(query, (err, res) => {
        if(err){
            console.log(err);
        }
        cb();
    });
}

module.exports = {
    init
};
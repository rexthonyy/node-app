const { Pool, Client } = require('pg');

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT
});

pool.query('SELECT NOW()', (err, res) => {
    if(err){
        console.log("Kratos database initialization failed!!!");
    }else{
        console.log("Kratos database initialized successfully!!!");
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

const getSelfServiceErrorById = (values, response) => {
    pool.query("SELECT * from selfservice_errors WHERE id=$1", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                code: 201
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getSelfServiceLoginFlowById = (values, response) => {
    pool.query("SELECT * from selfservice_login_flows WHERE id=$1", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                code: 201
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getSelfServiceRecoveryFlowById = (values, response) => {
    pool.query("SELECT * from selfservice_recovery_flows WHERE id=$1", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                code: 201
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getSelfServiceRegistrationFlowById = (values, response) => {
    pool.query("SELECT * from selfservice_registration_flows WHERE id=$1", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                code: 201
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getSelfServiceVerificationFlowById = (values, response) => {
    pool.query("SELECT * from selfservice_verification_flows WHERE id=$1", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                code: 201
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getSelfServiceSettingsFlowById = (values, response) => {
    pool.query("SELECT * from selfservice_settings_flows WHERE id=$1", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                code: 201
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getNetworks = (response) => {
    pool.query("SELECT * from networks", (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                code: 201
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getIdentities = (values, response) => {
    pool.query("SELECT * from identities LIMIT $1 OFFSET $2", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                code: 201
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getIdentityById = (values, response) => {
    pool.query("SELECT * from identities WHERE id = $1", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                code: 201
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getRecoveryAddressesByIdentityId = (values, response) => {
    pool.query("SELECT * from identity_recovery_addresses WHERE identity_id = $1", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                code: 201
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getVerifiableAddressesByIdentityId = (values, response) => {
    pool.query("SELECT * from identity_verifiable_addresses WHERE identity_id = $1", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                code: 201
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

module.exports = {
    getSelfServiceErrorById,
    getSelfServiceLoginFlowById,
    getSelfServiceRecoveryFlowById,
    getSelfServiceRegistrationFlowById,
    getSelfServiceVerificationFlowById,
    getSelfServiceSettingsFlowById,
    getNetworks,
    getIdentities,
    getIdentityById,
    getRecoveryAddressesByIdentityId,
    getVerifiableAddressesByIdentityId
}
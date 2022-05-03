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
                code: 202
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
                code: 203
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
                code: 204
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
                code: 205
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
                code: 206
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getSessionByToken = (values, response) => {
    pool.query("SELECT * from sessions WHERE token=$1", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                code: 207
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
                code: 208
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
                code: 209
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
                code: 210
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
                code: 211
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
                code: 212
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getLoginFlowById = (values, response) => {
    pool.query("SELECT * from selfservice_login_flows WHERE id = $1", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                code: 213
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getRegistrationFlowById = (values, response) => {
    pool.query("SELECT * from selfservice_registration_flows WHERE id = $1", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                code: 214
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getIdentityCredentialsByIdentityCredentialTypeId = (values, response) => {
    pool.query("SELECT * from identity_credentials WHERE identity_credential_type_id = $1", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                code: 215
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getIdentityCredentialIdentifierByIdentityCredentialIdAndIdentityCredentialTypeId = (values, response) => {
    pool.query("SELECT * from identity_credential_identifiers WHERE identity_credential_id=$1 AND identity_credential_type_id = $2", values, (err, res) => {
        if(err){
            response({
                err: err,
                res: null,
                code: 216
            });
        }else{
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createLoginFlow = (values, response) => {
    client.query('INSERT INTO selfservice_login_flows (id, request_url, issued_at, expires_at, active_method, csrf_token, created_at, updated_at, forced, type, ui, nid, requested_aal, internal_context) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 217
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const createRecoveryFlow = (values, response) => {
    client.query('INSERT INTO selfservice_recovery_flows (id, request_url, issued_at, expires_at, active_method, csrf_token, state, recovered_identity_id, created_at, updated_at, type, ui, nid) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const createRegistrationFlow = (values, response) => {
    client.query('INSERT INTO selfservice_registration_flows (id, request_url, issued_at, expires_at, active_method, csrf_token, created_at, updated_at, type, ui, nid, internal_context) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 184
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const createSettingsFlow = (values, response) => {
    client.query('INSERT INTO selfservice_settings_flows (id, request_url, issued_at, expires_at, identity_id, created_at, updated_at, active_method, state, type, ui, nid, internal_context) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 184
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const createVerificationFlow = (values, response) => {
    client.query('INSERT INTO selfservice_verification_flows (id, request_url, issued_at, expires_at, csrf_token, created_at, updated_at, type, state, active_method, ui, nid) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 184
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const createSession = (values, response) => {
    client.query('INSERT INTO sessions (id, issued_at, expires_at, authenticated_at, identity_id, created_at, updated_at, token, active, nid, logout_token, aal, authentication_methods) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 184
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const createIdentity = (values, response) => {
    client.query('INSERT INTO identities (id, schema_id, traits, created_at, updated_at, nid, state, state_changed_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 184
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const createIdentityCredentials = (values, response) => {
    client.query('INSERT INTO identity_credentials (id, config, identity_credential_type_id, identity_id, created_at, updated_at, nid) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 184
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const createIdentityCredentialIdentifier = (values, response) => {
    client.query('INSERT INTO identity_credential_identifiers (id, identifier, identity_credential_id, created_at, updated_at, nid, identity_credential_type_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 184
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
    getVerifiableAddressesByIdentityId,
    getSessionByToken,
    getLoginFlowById,
    getRegistrationFlowById,
    getIdentityCredentialsByIdentityCredentialTypeId,
    getIdentityCredentialIdentifierByIdentityCredentialIdAndIdentityCredentialTypeId,

    createLoginFlow,
    createRecoveryFlow,
    createRegistrationFlow,
    createSettingsFlow,
    createVerificationFlow,
    createSession,
    createIdentity,
    createIdentityCredentials,
    createIdentityCredentialIdentifier,
}
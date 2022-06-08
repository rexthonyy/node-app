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


const getUserByEmail = (values, response) => {
    pool.query(`SELECT * from ${db.account_user} WHERE email=$1`, values, (err, res) => {
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

const getUserById = (values, response) => {
    pool.query(`SELECT * from ${db.account_user} WHERE id=$1`, values, (err, res) => {
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

const getUserByIsStaff = (values, response) => {
    pool.query(`SELECT * from ${db.account_user} WHERE is_staff=$1`, values, (err, res) => {
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

const getAccountUserAddressesByUserId = (values, response) => {
    pool.query(`SELECT * from ${db.account_user_addresses} WHERE user_id=$1`, values, (err, res) => {
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

const getAccountAddressById = (values, response) => {
    pool.query(`SELECT * from ${db.account_address} WHERE id=$1`, values, (err, res) => {
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

const createAccountUser = (values, response) => {
    client.query(`INSERT INTO ${db.account_user} (is_superuser, email, is_staff, is_active, password, date_joined, last_login, default_billing_address_id, default_shipping_address_id, note, first_name, last_name, avatar, private_metadata, metadata, jwt_token_key, language_code, search_document, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $17, $18, $19) RETURNING *`, values, (err, res) => {
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

const createRecoveryFlow = (values, response) => {
    client.query('INSERT INTO selfservice_recovery_flows (id, request_url, issued_at, expires_at, active_method, csrf_token, state, recovered_identity_id, created_at, updated_at, type, ui, nid) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 219
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
                tes: 220
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
                tes: 221
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
                tes: 222
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
                tes: 223
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
                tes: 224
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
                tes: 225
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
                tes: 226
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const createIdentityRecoveryAddress = (values, response) => {
    client.query('INSERT INTO identity_recovery_addresses (id, via, value, identity_id, created_at, updated_at, nid) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 227
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const createIdentityRecoveryToken = (values, response) => {
    client.query('INSERT INTO identity_recovery_tokens (id, token, used, used_at, identity_recovery_address_id, selfservice_recovery_flow_id, created_at, updated_at, expires_at, issued_at, nid) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 228
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};



const updateIdentity = (values, response) => {
    client.query('UPDATE identities SET schema_id=$2, traits=$3, updated_at=$4 WHERE id=$1 RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 229
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateIdentityCredentials = (values, response) => {
    client.query('UPDATE identity_credentials SET config=$2, updated_at=$3 WHERE id=$1 RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 230
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const createSessionToken = (values, response) => {
    client.query(`INSERT INTO ${db.oauth_sessions} (token) VALUES($1) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                tes: 227
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};


const getSessionToken = (values, response) => {
    pool.query(`SELECT * from ${db.oauth_sessions} WHERE token=$1`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 216
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
    getUserByEmail,
    getUserById,
    getUserByIsStaff,
    getAccountUserAddressesByUserId,
    getAccountAddressById,

    createAccountUser,
    createAccountAddress,
    createAccountUserAddress,

    createRecoveryFlow,
    createRegistrationFlow,
    createSettingsFlow,
    createVerificationFlow,
    createSession,
    createIdentity,
    createIdentityCredentials,
    createIdentityCredentialIdentifier,
    createIdentityRecoveryAddress,
    createIdentityRecoveryToken,

    updateIdentity,
    updateIdentityCredentials,

    createSessionToken,
    getSessionToken,
}
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

        createKratosDatabase(() => {
            console.log("Kratos database created successfully");
            resolve();
        });
    });
}

function createKratosDatabase(cb){
    pool.query("CREATE DATABASE $1", [databaseName], (err, res) => {
        if(err){
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

        createContinuityContainersTB(() => {
            console.log("Done creating continuity_containers table");
            createCourierMessagesTB(() => {
                console.log("Done creating courier_messages table");
                createIdentitiesTB(() => {
                    console.log("Done creating identities table");
                    createIdentityCredentialIdentifiersTB(() => {
                        console.log("Done creating identity_credential_identifiers table");
                        createIdentityCredentialTypesTB(() => {
                            console.log("Done creating identity_credential_types table");
                            createIdentityCredentialsTB(() => {
                                console.log("Done creating identity_credentials table");
                                createIdentityRecoveryAddressesTB(() => {
                                    console.log("Done creating identity_recovery_addresses table");
                                    createIdentityRecoveryTokensTB(() => {
                                        console.log("Done creating identity_recovery_tokens table");
                                        createIdentityVerifiableAddressesTB(() => {
                                            console.log("Done creating identity_verifiable_addresses table");
                                            createIdentityVerificationTokensTB(() => {
                                                console.log("Done creating identity_verification_tokens table");
                                                createNetworksTB(() => {
                                                    console.log("Done creating networks table");
                                                    createSchemaMigrationTB(() => {
                                                        console.log("Done creating schema_migration table");
                                                        createSelfServiceErrorsTB(() => {
                                                            console.log("Done creating selfservice_errors table");
                                                            createSelfServiceLoginFlowsTB(() => {
                                                                console.log("Done creating selfservice_login_flows table");
                                                                createSelfServiceRecoveryFlowsTB(() => {
                                                                    console.log("Done creating selfservice_recovery_flows table");
                                                                    createSelfServiceRegistrationFlowsTB(() => {
                                                                        console.log("Done creating selfservice_registration_flows table");
                                                                        createSelfServiceSettingsFlowsTB(() => {
                                                                            console.log("Done creating selfservice_settings_flows table");
                                                                            createSelfServiceVerificationFlowsTB(() => {
                                                                                console.log("Done creating selfservice_verification_flows table");
                                                                                createSessionsTB(() => {
                                                                                    console.log("Done creating sessions table");
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
                                            });
                                        });
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

function createContinuityContainersTB(cb){
    let query = 
    `CREATE TABLE IF NOT EXISTS continuity_containers (
        id serial primary key not null, 
        identity_id varchar,
        name varchar not null, 
        payload jsonb,
        expires_at timestamp without time zone not null, 
        created_at timestamp without time zone not null, 
        updated_at timestamp without time zone not null, 
        nid varchar
    )`;
    client.query(query, (err, res) => {
        if(err){
            console.log(err);
        }
        cb();
    });
}

function createCourierMessagesTB(cb){
    let query = 
    `CREATE TABLE IF NOT EXISTS courier_messages (
        id serial primary key not null, 
        type integer not null,
        status integer not null,
        body text not null, 
        subject varchar not null,
        recipient varchar not null, 
        created_at timestamp without time zone not null, 
        updated_at timestamp without time zone not null,
        template_type varchar not null default '',
        template_data bytea,
        nid varchar
    )`;
    client.query(query, (err, res) => {
        if(err){
            console.log(err);
        }
        cb();
    });
}

function createIdentitiesTB(cb){
    let query = 
    `CREATE TABLE IF NOT EXISTS identities (
        id serial primary key not null, 
        schema_id varchar not null,
        traits jsonb not null,
        created_at timestamp without time zone not null,
        updated_at timestamp without time zone not null,
        nid varchar,
        state varchar not null default 'active',
        state_changed_at timestamp without time zone
    )`;
    client.query(query, (err, res) => {
        if(err){
            console.log(err);
        }
        cb();
    });
}

function createIdentityCredentialIdentifiersTB(cb){
    let query = 
    `CREATE TABLE IF NOT EXISTS identity_credential_identifiers (
        id serial primary key not null, 
        identifier varchar not null,
        identify_credential_id varchar,
        created_at timestamp without time zone not null, 
        updated_at timestamp without time zone not null
    )`;
    client.query(query, (err, res) => {
        if(err){
            console.log(err);
        }
        cb();
    });
}

function createIdentityCredentialTypesTB(cb){
    let query = 
    `CREATE TABLE IF NOT EXISTS identity_credential_types (
        id serial primary key not null, 
        name varchar not null
    )`;
    client.query(query, (err, res) => {
        if(err){
            console.log(err);
        }
        cb();
    });
}

function createIdentityCredentialsTB(cb){
    let query = 
    `CREATE TABLE IF NOT EXISTS identity_credentials (
        id serial primary key not null, 
        config jsonb not null,
        identity_credential_type_id varchar,
        identity_id varchar,
        created_at timestamp without time zone not null,
        updated_at timestamp without time zone not null,
        nid varchar
    )`;
    client.query(query, (err, res) => {
        if(err){
            console.log(err);
        }
        cb();
    });
}

function createIdentityRecoveryAddressesTB(cb){
    let query = 
    `CREATE TABLE IF NOT EXISTS identity_recovery_addresses (
        id serial primary key not null, 
        via varchar not null,
        value varchar not null,
        identity_id varchar not null,
        created_at timestamp without time zone not null,
        updated_at timestamp without time zone not null,
        nid varchar
    )`;
    client.query(query, (err, res) => {
        if(err){
            console.log(err);
        }
        cb();
    });
}

function createIdentityRecoveryTokensTB(cb){
    let query = 
    `CREATE TABLE IF NOT EXISTS identity_recovery_tokens (
        id serial primary key not null, 
        token varchar not null,
        used boolean not null default false,
        used_at timestamp without time zone,
        identity_recovery_address_id varchar not null,
        selfservice_recovery_flow_id varchar,
        created_at timestamp without time zone not null,
        updated_at timestamp without time zone not null, 
        expires_at timestamp without time zone not null default timezone('utc'::text, now()), 
        issued_at timestamp without time zone not null default timezone('utc'::text, now()), 
        nid varchar
    )`;
    client.query(query, (err, res) => {
        if(err){
            console.log(err);
        }
        cb();
    });
}

function createIdentityVerifiableAddressesTB(cb){
    let query = 
    `CREATE TABLE IF NOT EXISTS identity_verifiable_addresses (
        id serial primary key not null, 
        status varchar not null,
        via varchar not null,
        verified boolean not null,
        value varchar not null,
        verified_at timestamp without time zone,
        identity_id varchar not null,
        created_at timestamp without time zone not null, 
        updated_at timestamp without time zone not null,
        nid varchar
    )`;
    client.query(query, (err, res) => {
        if(err){
            console.log(err);
        }
        cb();
    });
}

function createIdentityVerificationTokensTB(cb){
    let query = 
    `CREATE TABLE IF NOT EXISTS identity_verification_tokens (
        id serial primary key not null, 
        token varchar not null,
        used boolean not null default false,
        used_at timestamp without time zone not null,
        expires_at timestamp without time zone not null,
        issued_at timestamp without time zone not null,
        identity_verifiable_address_id varchar not null,
        selfservice_verification_flow_id varchar,
        created_at timestamp without time zone not null, 
        updated_at timestamp without time zone not null,
        nid varchar
    )`;
    client.query(query, (err, res) => {
        if(err){
            console.log(err);
        }
        cb();
    });
}

function createNetworksTB(cb){
    let query = 
    `CREATE TABLE IF NOT EXISTS networks (
        id serial primary key not null,
        created_at timestamp without time zone not null, 
        updated_at timestamp without time zone not null
    )`;
    client.query(query, (err, res) => {
        if(err){
            console.log(err);
        }
        cb();
    });
}

function createSchemaMigrationTB(cb){
    let query = 
    `CREATE TABLE IF NOT EXISTS schema_migration (
        version varchar not null,
        version_self integer not null default 0
    )`;
    client.query(query, (err, res) => {
        if(err){
            console.log(err);
        }
        cb();
    });
}

function createSelfServiceErrorsTB(cb){
    let query = 
    `CREATE TABLE IF NOT EXISTS selfservice_errors (
        id varchar not null,
        errors jsonb not null,
        seen_at timestamp without time zone,
        was_seen boolean not null,
        created_at timestamp without time zone not null, 
        updated_at timestamp without time zone not null,
        nid varchar
    )`;
    client.query(query, (err, res) => {
        if(err){
            console.log(err);
        }
        cb();
    });
}

function createSelfServiceLoginFlowsTB(cb){
    let query = 
    `CREATE TABLE IF NOT EXISTS selfservice_login_flows (
        id varchar not null,
        request_url varchar not null,
        issued_at timestamp without time zone not null default CURRENT_TIMESTAMP,
        expires_at timestamp without time zone not null,
        active_method varchar not null,
        csrf_token varchar not null,
        created_at timestamp without time zone not null, 
        updated_at timestamp without time zone not null,
        forced boolean not null default false,
        type varchar not null default 'browser',
        ui jsonb,
        nid varchar,
        requested_aal varchar not null default 'aal1',
        internal_context jsonb not null
    )`;
    client.query(query, (err, res) => {
        if(err){
            console.log(err);
        }
        cb();
    });
}

function createSelfServiceRecoveryFlowsTB(cb){
    let query = 
    `CREATE TABLE IF NOT EXISTS selfservice_recovery_flows (
        id varchar not null,
        request_url varchar not null,
        issued_at timestamp without time zone not null default CURRENT_TIMESTAMP,
        expires_at timestamp without time zone not null,
        active_method varchar not null,
        csrf_token varchar not null,
        state varchar not null,
        recovered_identity_id varchar,
        created_at timestamp without time zone not null, 
        updated_at timestamp without time zone not null,
        type varchar not null default 'browser',
        ui jsonb,
        nid varchar
    )`;
    client.query(query, (err, res) => {
        if(err){
            console.log(err);
        }
        cb();
    });
}

function createSelfServiceRegistrationFlowsTB(cb){
    let query = 
    `CREATE TABLE IF NOT EXISTS selfservice_registration_flows (
        id varchar not null,
        request_url varchar not null,
        issued_at timestamp without time zone not null default CURRENT_TIMESTAMP,
        expires_at timestamp without time zone not null,
        active_method varchar not null,
        csrf_token varchar not null,
        recovered_identity_id varchar,
        created_at timestamp without time zone not null, 
        updated_at timestamp without time zone not null,
        type varchar not null default 'browser',
        ui jsonb,
        nid varchar,
        internal_context jsonb not null
    )`;
    client.query(query, (err, res) => {
        if(err){
            console.log(err);
        }
        cb();
    });
}

function createSelfServiceSettingsFlowsTB(cb){
    let query = 
    `CREATE TABLE IF NOT EXISTS selfservice_settings_flows (
        id varchar not null,
        request_url varchar not null,
        issued_at timestamp without time zone not null default CURRENT_TIMESTAMP,
        expires_at timestamp without time zone not null,
        identity_id varchar not null,
        created_at timestamp without time zone not null, 
        updated_at timestamp without time zone not null,
        active_method varchar not null,
        state varchar not null default 'show_form',
        type varchar not null default 'browser',
        ui jsonb,
        nid varchar,
        internal_context jsonb not null
    )`;
    client.query(query, (err, res) => {
        if(err){
            console.log(err);
        }
        cb();
    });
}

function createSelfServiceVerificationFlowsTB(cb){
    let query = 
    `CREATE TABLE IF NOT EXISTS selfservice_verification_flows (
        id varchar not null,
        request_url varchar not null,
        issued_at timestamp without time zone not null default CURRENT_TIMESTAMP,
        expires_at timestamp without time zone not null,
        csrf_token varchar not null,
        created_at timestamp without time zone not null, 
        updated_at timestamp without time zone not null,
        type varchar not null default 'browser',
        state varchar not null default 'show_form',
        active_method varchar,
        ui jsonb,
        nid varchar
    )`;
    client.query(query, (err, res) => {
        if(err){
            console.log(err);
        }
        cb();
    });
}

function createSessionsTB(cb){
    let query = 
    `CREATE TABLE IF NOT EXISTS sessions (
        id varchar not null,
        issued_at timestamp without time zone not null default CURRENT_TIMESTAMP,
        expires_at timestamp without time zone not null,
        authenticated_at timestamp without time zone not null,
        identity_id varchar not null,
        created_at timestamp without time zone not null, 
        updated_at timestamp without time zone not null,
        token varchar,
        active boolean default false,
        nid varchar,
        logout_token varchar,
        aal varchar not null default 'aal1',
        authentication_methods jsonb not null
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
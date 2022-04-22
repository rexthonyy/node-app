var _a = require('pg'), Pool = _a.Pool, Client = _a.Client;
var pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: "postgres",
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT
});
var client = null;
var databaseName = process.env.POSTGRES_DB;
var init = function () {
    return new Promise(function (resolve, reject) {
        createKratosDatabase(function () {
            console.log("Kratos database created successfully");
            resolve();
        });
    });
};
function createKratosDatabase(cb) {
    pool.query("CREATE DATABASE $1", [databaseName], function (err, res) {
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
        createContinuityContainersTB(function () {
            console.log("Done creating continuity_containers table");
            createCourierMessagesTB(function () {
                console.log("Done creating courier_messages table");
                createIdentitiesTB(function () {
                    console.log("Done creating identities table");
                    createIdentityCredentialIdentifiersTB(function () {
                        console.log("Done creating identity_credential_identifiers table");
                        createIdentityCredentialTypesTB(function () {
                            console.log("Done creating identity_credential_types table");
                            createIdentityCredentialsTB(function () {
                                console.log("Done creating identity_credentials table");
                                createIdentityRecoveryAddressesTB(function () {
                                    console.log("Done creating identity_recovery_addresses table");
                                    createIdentityRecoveryTokensTB(function () {
                                        console.log("Done creating identity_recovery_tokens table");
                                        createIdentityVerifiableAddressesTB(function () {
                                            console.log("Done creating identity_verifiable_addresses table");
                                            createIdentityVerificationTokensTB(function () {
                                                console.log("Done creating identity_verification_tokens table");
                                                createNetworksTB(function () {
                                                    console.log("Done creating networks table");
                                                    createSchemaMigrationTB(function () {
                                                        console.log("Done creating schema_migration table");
                                                        createSelfServiceErrorsTB(function () {
                                                            console.log("Done creating selfservice_errors table");
                                                            createSelfServiceLoginFlowsTB(function () {
                                                                console.log("Done creating selfservice_login_flows table");
                                                                createSelfServiceRecoveryFlowsTB(function () {
                                                                    console.log("Done creating selfservice_recovery_flows table");
                                                                    createSelfServiceRegistrationFlowsTB(function () {
                                                                        console.log("Done creating selfservice_registration_flows table");
                                                                        createSelfServiceSettingsFlowsTB(function () {
                                                                            console.log("Done creating selfservice_settings_flows table");
                                                                            createSelfServiceVerificationFlowsTB(function () {
                                                                                console.log("Done creating selfservice_verification_flows table");
                                                                                createSessionsTB(function () {
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
function createContinuityContainersTB(cb) {
    var query = "CREATE TABLE IF NOT EXISTS continuity_containers (\n        id serial primary key not null, \n        identity_id varchar,\n        name varchar not null, \n        payload jsonb,\n        expires_at timestamp without time zone not null, \n        created_at timestamp without time zone not null, \n        updated_at timestamp without time zone not null, \n        nid varchar\n    )";
    client.query(query, function (err, res) {
        if (err) {
            console.log(err);
        }
        cb();
    });
}
function createCourierMessagesTB(cb) {
    var query = "CREATE TABLE IF NOT EXISTS courier_messages (\n        id serial primary key not null, \n        type integer not null,\n        status integer not null,\n        body text not null, \n        subject varchar not null,\n        recipient varchar not null, \n        created_at timestamp without time zone not null, \n        updated_at timestamp without time zone not null,\n        template_type varchar not null default '',\n        template_data bytea,\n        nid varchar\n    )";
    client.query(query, function (err, res) {
        if (err) {
            console.log(err);
        }
        cb();
    });
}
function createIdentitiesTB(cb) {
    var query = "CREATE TABLE IF NOT EXISTS identities (\n        id serial primary key not null, \n        schema_id varchar not null,\n        traits jsonb not null,\n        created_at timestamp without time zone not null,\n        updated_at timestamp without time zone not null,\n        nid varchar,\n        state varchar not null default 'active',\n        state_changed_at timestamp without time zone\n    )";
    client.query(query, function (err, res) {
        if (err) {
            console.log(err);
        }
        cb();
    });
}
function createIdentityCredentialIdentifiersTB(cb) {
    var query = "CREATE TABLE IF NOT EXISTS identity_credential_identifiers (\n        id serial primary key not null, \n        identifier varchar not null,\n        identify_credential_id varchar,\n        created_at timestamp without time zone not null, \n        updated_at timestamp without time zone not null\n    )";
    client.query(query, function (err, res) {
        if (err) {
            console.log(err);
        }
        cb();
    });
}
function createIdentityCredentialTypesTB(cb) {
    var query = "CREATE TABLE IF NOT EXISTS identity_credential_types (\n        id serial primary key not null, \n        name varchar not null\n    )";
    client.query(query, function (err, res) {
        if (err) {
            console.log(err);
        }
        cb();
    });
}
function createIdentityCredentialsTB(cb) {
    var query = "CREATE TABLE IF NOT EXISTS identity_credentials (\n        id serial primary key not null, \n        config jsonb not null,\n        identity_credential_type_id varchar,\n        identity_id varchar,\n        created_at timestamp without time zone not null,\n        updated_at timestamp without time zone not null,\n        nid varchar\n    )";
    client.query(query, function (err, res) {
        if (err) {
            console.log(err);
        }
        cb();
    });
}
function createIdentityRecoveryAddressesTB(cb) {
    var query = "CREATE TABLE IF NOT EXISTS identity_recovery_addresses (\n        id serial primary key not null, \n        via varchar not null,\n        value varchar not null,\n        identity_id varchar not null,\n        created_at timestamp without time zone not null,\n        updated_at timestamp without time zone not null,\n        nid varchar\n    )";
    client.query(query, function (err, res) {
        if (err) {
            console.log(err);
        }
        cb();
    });
}
function createIdentityRecoveryTokensTB(cb) {
    var query = "CREATE TABLE IF NOT EXISTS identity_recovery_tokens (\n        id serial primary key not null, \n        token varchar not null,\n        used boolean not null default false,\n        used_at timestamp without time zone,\n        identity_recovery_address_id varchar not null,\n        selfservice_recovery_flow_id varchar,\n        created_at timestamp without time zone not null,\n        updated_at timestamp without time zone not null, \n        expires_at timestamp without time zone not null default timezone('utc'::text, now()), \n        issued_at timestamp without time zone not null default timezone('utc'::text, now()), \n        nid varchar\n    )";
    client.query(query, function (err, res) {
        if (err) {
            console.log(err);
        }
        cb();
    });
}
function createIdentityVerifiableAddressesTB(cb) {
    var query = "CREATE TABLE IF NOT EXISTS identity_verifiable_addresses (\n        id serial primary key not null, \n        status varchar not null,\n        via varchar not null,\n        verified boolean not null,\n        value varchar not null,\n        verified_at timestamp without time zone,\n        identity_id varchar not null,\n        created_at timestamp without time zone not null, \n        updated_at timestamp without time zone not null,\n        nid varchar\n    )";
    client.query(query, function (err, res) {
        if (err) {
            console.log(err);
        }
        cb();
    });
}
function createIdentityVerificationTokensTB(cb) {
    var query = "CREATE TABLE IF NOT EXISTS identity_verification_tokens (\n        id serial primary key not null, \n        token varchar not null,\n        used boolean not null default false,\n        used_at timestamp without time zone not null,\n        expires_at timestamp without time zone not null,\n        issued_at timestamp without time zone not null,\n        identity_verifiable_address_id varchar not null,\n        selfservice_verification_flow_id varchar,\n        created_at timestamp without time zone not null, \n        updated_at timestamp without time zone not null,\n        nid varchar\n    )";
    client.query(query, function (err, res) {
        if (err) {
            console.log(err);
        }
        cb();
    });
}
function createNetworksTB(cb) {
    var query = "CREATE TABLE IF NOT EXISTS networks (\n        id serial primary key not null,\n        created_at timestamp without time zone not null, \n        updated_at timestamp without time zone not null\n    )";
    client.query(query, function (err, res) {
        if (err) {
            console.log(err);
        }
        cb();
    });
}
function createSchemaMigrationTB(cb) {
    var query = "CREATE TABLE IF NOT EXISTS schema_migration (\n        version varchar not null,\n        version_self integer not null default 0\n    )";
    client.query(query, function (err, res) {
        if (err) {
            console.log(err);
        }
        cb();
    });
}
function createSelfServiceErrorsTB(cb) {
    var query = "CREATE TABLE IF NOT EXISTS selfservice_errors (\n        id varchar not null,\n        errors jsonb not null,\n        seen_at timestamp without time zone,\n        was_seen boolean not null,\n        created_at timestamp without time zone not null, \n        updated_at timestamp without time zone not null,\n        nid varchar\n    )";
    client.query(query, function (err, res) {
        if (err) {
            console.log(err);
        }
        cb();
    });
}
function createSelfServiceLoginFlowsTB(cb) {
    var query = "CREATE TABLE IF NOT EXISTS selfservice_login_flows (\n        id varchar not null,\n        request_url varchar not null,\n        issued_at timestamp without time zone not null default CURRENT_TIMESTAMP,\n        expires_at timestamp without time zone not null,\n        active_method varchar not null,\n        csrf_token varchar not null,\n        created_at timestamp without time zone not null, \n        updated_at timestamp without time zone not null,\n        forced boolean not null default false,\n        type varchar not null default 'browser',\n        ui jsonb,\n        nid varchar,\n        requested_aal varchar not null default 'aal1',\n        internal_context jsonb not null\n    )";
    client.query(query, function (err, res) {
        if (err) {
            console.log(err);
        }
        cb();
    });
}
function createSelfServiceRecoveryFlowsTB(cb) {
    var query = "CREATE TABLE IF NOT EXISTS selfservice_recovery_flows (\n        id varchar not null,\n        request_url varchar not null,\n        issued_at timestamp without time zone not null default CURRENT_TIMESTAMP,\n        expires_at timestamp without time zone not null,\n        active_method varchar not null,\n        csrf_token varchar not null,\n        state varchar not null,\n        recovered_identity_id varchar,\n        created_at timestamp without time zone not null, \n        updated_at timestamp without time zone not null,\n        type varchar not null default 'browser',\n        ui jsonb,\n        nid varchar\n    )";
    client.query(query, function (err, res) {
        if (err) {
            console.log(err);
        }
        cb();
    });
}
function createSelfServiceRegistrationFlowsTB(cb) {
    var query = "CREATE TABLE IF NOT EXISTS selfservice_registration_flows (\n        id varchar not null,\n        request_url varchar not null,\n        issued_at timestamp without time zone not null default CURRENT_TIMESTAMP,\n        expires_at timestamp without time zone not null,\n        active_method varchar not null,\n        csrf_token varchar not null,\n        recovered_identity_id varchar,\n        created_at timestamp without time zone not null, \n        updated_at timestamp without time zone not null,\n        type varchar not null default 'browser',\n        ui jsonb,\n        nid varchar,\n        internal_context jsonb not null\n    )";
    client.query(query, function (err, res) {
        if (err) {
            console.log(err);
        }
        cb();
    });
}
function createSelfServiceSettingsFlowsTB(cb) {
    var query = "CREATE TABLE IF NOT EXISTS selfservice_settings_flows (\n        id varchar not null,\n        request_url varchar not null,\n        issued_at timestamp without time zone not null default CURRENT_TIMESTAMP,\n        expires_at timestamp without time zone not null,\n        identity_id varchar not null,\n        created_at timestamp without time zone not null, \n        updated_at timestamp without time zone not null,\n        active_method varchar not null,\n        state varchar not null default 'show_form',\n        type varchar not null default 'browser',\n        ui jsonb,\n        nid varchar,\n        internal_context jsonb not null\n    )";
    client.query(query, function (err, res) {
        if (err) {
            console.log(err);
        }
        cb();
    });
}
function createSelfServiceVerificationFlowsTB(cb) {
    var query = "CREATE TABLE IF NOT EXISTS selfservice_verification_flows (\n        id varchar not null,\n        request_url varchar not null,\n        issued_at timestamp without time zone not null default CURRENT_TIMESTAMP,\n        expires_at timestamp without time zone not null,\n        csrf_token varchar not null,\n        created_at timestamp without time zone not null, \n        updated_at timestamp without time zone not null,\n        type varchar not null default 'browser',\n        state varchar not null default 'show_form',\n        active_method varchar,\n        ui jsonb,\n        nid varchar\n    )";
    client.query(query, function (err, res) {
        if (err) {
            console.log(err);
        }
        cb();
    });
}
function createSessionsTB(cb) {
    var query = "CREATE TABLE IF NOT EXISTS sessions (\n        id varchar not null,\n        issued_at timestamp without time zone not null default CURRENT_TIMESTAMP,\n        expires_at timestamp without time zone not null,\n        authenticated_at timestamp without time zone not null,\n        identity_id varchar not null,\n        created_at timestamp without time zone not null, \n        updated_at timestamp without time zone not null,\n        token varchar,\n        active boolean default false,\n        nid varchar,\n        logout_token varchar,\n        aal varchar not null default 'aal1',\n        authentication_methods jsonb not null\n    )";
    client.query(query, function (err, res) {
        if (err) {
            console.log(err);
        }
        cb();
    });
}
module.exports = {
    init: init
};

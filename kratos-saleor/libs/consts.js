const fs = require('fs');
const YAML = require('yaml');

const config = YAML.parse(fs.readFileSync('./config/index.yml', 'utf8'));
const NETWORK_ID = config.network_id;
const IDENTITY_CREDENTIAL_TYPE_PASSWORD = config.identity_credential_type_ids.password.id;
const IDENTITY_CREDENTIAL_TYPE_LOOKUP_SECRET = config.identity_credential_type_ids.lookup_secret.id;
const expiresIn = config.session.expires_in;

const db = {
    oauth_sessions: "oauth_sessions",
    account_user: "account_user",
    account_address: "account_address",
    account_user_addresses: "account_user_addresses",
};

module.exports = {
    NETWORK_ID,
    IDENTITY_CREDENTIAL_TYPE_PASSWORD,
    IDENTITY_CREDENTIAL_TYPE_LOOKUP_SECRET,
    db,
    expiresIn
};
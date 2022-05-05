const fs = require('fs');
const YAML = require('yaml');

const config = YAML.parse(fs.readFileSync('./config/index.yml', 'utf8'));
const NETWORK_ID = config.network_id;
const IDENTITY_CREDENTIAL_TYPE_PASSWORD = config.identity_credential_type_ids.password.id;

module.exports = {
    NETWORK_ID,
    IDENTITY_CREDENTIAL_TYPE_PASSWORD
};
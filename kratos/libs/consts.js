const fs = require('fs');
const YAML = require('yaml');

const config = YAML.parse(fs.readFileSync('./config/index.yml', 'utf8'));
const NETWORK_ID = config.network_id;
const IDENTITY_CREDENTIAL_TYPE_PASSWORD = config.identity_credential_type_ids.password.id;

//const NETWORK_ID = "9f900efa-a5ea-4dfd-8311-a8c7448ffeec";
//const IDENTITY_CREDENTIAL_TYPE_PASSWORD = "78c1b41d-8341-4507-aa60-aff1d4369670";


module.exports = {
    NETWORK_ID,
    IDENTITY_CREDENTIAL_TYPE_PASSWORD
};
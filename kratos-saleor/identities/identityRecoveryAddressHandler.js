const fs = require('fs');
const YAML = require('yaml');

class IdentityRecoveryAddressHandler {
    constructor(){
        const file = fs.readFileSync('./config/index.yml', 'utf8')
        this.config = YAML.parse(file);
    }

    getVia(){
        return this.config.identity_recovery_address.via;
    }
}

const handler = new IdentityRecoveryAddressHandler();

const getVia = () => {
    return handler.getVia();
};


module.exports = {
    getVia
}
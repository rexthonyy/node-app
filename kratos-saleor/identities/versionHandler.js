const fs = require('fs');
const YAML = require('yaml');

class SessionHandler {
    constructor(){
        const file = fs.readFileSync('./config/index.yml', 'utf8')
        this.config = YAML.parse(file);
    }

    getVersion(){
        return this.config.version;
    }
}

const handler = new SessionHandler();

const getVersion = () => {
  return handler.getVersion();
};

module.exports = {
    getVersion
}
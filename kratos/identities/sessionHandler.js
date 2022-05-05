const fs = require('fs');
const YAML = require('yaml');
const {uuid} = require('uuidv4');

class SessionHandler {
    constructor(){
        const file = fs.readFileSync('./config/index.yml', 'utf8')
        this.config = YAML.parse(file);
    }

    getExpiresAt(){
        return new Date(new Date().setMilliseconds(new Date().getMilliseconds() + this.config.session.expires_at));
    }

    generateToken(){
        return uuid().substring(0, 30);
    }

    generateLogoutToken(){
        return this.generateToken();
    }

    getRequestedAal(){
        return this.config.session.requested_aal;
    }

    getAuthenticationMethods(){
        return this.config.session.authentication_method;
    }
}

const handler = new SessionHandler();

const getExpiresAt = () => {
  return handler.getExpiresAt();
};

const generateToken = () => {
  return handler.generateToken();
};

const generateLogoutToken = () => {
  return handler.generateLogoutToken();
};

const getRequestedAal = () => {
    return handler.getRequestedAal();
};

const getAuthenticationMethods = () => {
    return handler.getAuthenticationMethods();
};

module.exports = {
    getExpiresAt,
    generateToken,
    generateLogoutToken,
    getRequestedAal,
    getAuthenticationMethods
}
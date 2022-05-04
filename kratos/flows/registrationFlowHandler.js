const fs = require('fs');
const YAML = require('yaml');

class RegistrationFlowHandler {
    constructor(){
        const file = fs.readFileSync('./config/flows/registration.yml', 'utf8')
        this.config = YAML.parse(file);
    }

    getRequestUrl(){
        return this.config.flow.request_url;
    }

    getExpiresAt(){
        return new Date(new Date().setMilliseconds(new Date().getMilliseconds() + this.config.flow.expires_at));
    }

    getActiveMethod(){
        return this.config.flow.active_method;
    }

    getType(){
        return this.config.flow.type;
    }

    getUI(){
        return this.config.flow.ui;
    }
    
    getInternalContext(){
        return this.config.flow.internal_context;
    }
}

const handler = new RegistrationFlowHandler();

const getRequestUrl = () => {
    return handler.getRequestUrl();
};

const getExpiresAt = () => {
    return handler.getExpiresAt();
};

const getActiveMethod = () => {
    return handler.getActiveMethod();
};

const getType = () => {
    return handler.getType();
};

const getUI = () => {
    return handler.getUI();
};

const getInternalContext = () => {
    return handler.getInternalContext();
};

module.exports = {
    getRequestUrl,
    getExpiresAt,
    getActiveMethod,
    getType,
    getUI,
    getInternalContext
}
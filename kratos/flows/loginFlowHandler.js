const fs = require('fs');
const YAML = require('yaml');

class LoginFlowHandler {
    constructor(){
        const file = fs.readFileSync('./config/flows/login.yml', 'utf8')
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

    getRequestedAal(){
        return this.config.flow.requested_aal;
    }

    getInternalContext(){
        return this.config.flow.internal_context;
    }
}

const handler = new LoginFlowHandler();

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

const getRequestedAal = () => {
    return handler.getRequestedAal();
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
    getRequestedAal,
    getUI,
    getInternalContext
}
const fs = require('fs');
const YAML = require('yaml');

class RecoveryFlowHandler {
    constructor(){
        const file = fs.readFileSync('./config/flows/recovery.yml', 'utf8')
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

    getState(){
        return this.config.flow.state;
    }

    getRecoveredIdentityId(){
        return this.config.flow.recovered_identity_id;
    }

    getType(){
        return this.config.flow.type;
    }

    getUI(){
        return this.config.flow.ui;
    }
}

const handler = new RecoveryFlowHandler();

const getRequestUrl = () => {
    return handler.getRequestUrl();
};

const getExpiresAt = () => {
    return handler.getExpiresAt();
};

const getActiveMethod = () => {
    return handler.getActiveMethod();
};

const getState = () => {
    return handler.getState();
};

const getRecoveredIdentityId = () => {
    return handler.getRecoveredIdentityId();
};

const getType = () => {
    return handler.getType();
};

const getUI = () => {
    return handler.getUI();
};

module.exports = {
    getRequestUrl,
    getExpiresAt,
    getActiveMethod,
    getState,
    getRecoveredIdentityId,
    getType,
    getUI
}
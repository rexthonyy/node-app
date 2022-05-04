const fs = require('fs');
const YAML = require('yaml');

class SettingsFlowHandler {
    constructor(){
        const file = fs.readFileSync('./config/flows/settings.yml', 'utf8')
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

    getState(){
        return this.config.flow.state;
    }

    getUI(){
        return this.config.flow.ui;
    }

    getInternalContext(){
        return this.config.flow.internal_context;
    }
}

const handler = new SettingsFlowHandler();
const getRequestUrl = handler.getRequestUrl;
const getExpiresAt = handler.getExpiresAt;
const getActiveMethod = handler.getActiveMethod;
const getType = handler.getType;
const getState = handler.getState;
const getUI = handler.getUI;
const getInternalContext = handler.getInternalContext;

module.exports = {
    getRequestUrl,
    getExpiresAt,
    getActiveMethod,
    getType,
    getState,
    getUI,
    getInternalContext
}
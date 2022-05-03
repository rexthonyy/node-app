const fs = require('fs');
const YAML = require('yaml');

class SettingsFlowHandler {
    constructor(){
        const file = fs.readFileSync('./config/flows/settings.yml', 'utf8')
        console.log(YAML.parse(file));
    }

    getRequestUrl(){
        return "/";
    }

    getExpiresAt(){
        return new Date(new Date().setMinutes(new Date().getMinutes() + 120));
    }

    getActiveMethod(){
        return "password";
    }

    getType(){
        return "api";
    }

    getState(){
        return "choose method"; //"choose_method" "sent_email" "passed_challenge"
    }

    getUI(){
        return JSON.stringify({
            action: "/",
            method: "post",
            messages: [
                {
                    context: "current",
                    id: "attr",
                    text: "info",
                    type: "ui"
                }
            ],
            nodes: {
                attributes: {
                    type: "id"
                },
                group: "none",
                type: "ui",
                messages: {
                    context: "current",
                    id: "attr",
                    text: "info",
                    type: "ui"
                }
            }
        });
    }

    getInternalContext(){
        return "{}";
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
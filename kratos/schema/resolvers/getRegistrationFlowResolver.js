let {uuid} = require("uuidv4");
const pgKratosQueries = require('../../postgres/kratos-queries');
const registrationFlowHandler = require('../../flows/registrationFlowHandler');
const consts = require('../../libs/consts');
const getData = () => {
    return new Promise((resolve, reject) => {
        let now = new Date().toUTCString();
        const values = [
            uuid(),
            registrationFlowHandler.getRequestUrl(),
            now,
            registrationFlowHandler.getExpiresAt().toUTCString(),
            registrationFlowHandler.getActiveMethod(),
            uuid(),
            now,
            now,
            registrationFlowHandler.getType(),
            JSON.stringify(registrationFlowHandler.getUI()),
            consts.NETWORK_ID,
            JSON.stringify(registrationFlowHandler.getInternalContext())
        ];
        pgKratosQueries.createRegistrationFlow(values, result => {
            if(result.err || result.res.length == 0){
                return reject("Failed to create registration flow");
            }

            let selfServiceRegistrationFlow = result.res;

            let id = selfServiceRegistrationFlow.id;
            let active = selfServiceRegistrationFlow.active_method;
            let expiresAt = selfServiceRegistrationFlow.expires_at;
            let issuedAt = selfServiceRegistrationFlow.issued_at;
            let requestUrl = selfServiceRegistrationFlow.request_url;
            let messages = selfServiceRegistrationFlow.ui.messages;
            let methods = selfServiceRegistrationFlow.ui.method;
            let type = selfServiceRegistrationFlow.type;

            resolve({
                active,
                expiresAt,
                id,
                issuedAt,
                messages,
                methods,
                requestUrl,
                type
            });
        });
        /*
        resolve({
            active: "active",
            expiresAt: "2022-01",
            id: "12d",
            issuedAt: "2022-02",
            messages: [{
                context: "api",
                id: 1,
                text: "update",
                type: "container"
            }],
            methods: "post",
            requestUrl: "/root",
            type: "browser"
        });*/
    });
}

module.exports = async () => {
    return getData();
}
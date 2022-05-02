let {uuid} = require("uuidv4");
const pgKratosQueries = require('../../postgres/kratos-queries');
const verificationFlowHandler = require('../../flows/verificationFlowHandler');
const consts = require('../../libs/consts');
const getData = () => {
    return new Promise((resolve, reject) => {
        let now = new Date().toUTCString();
        const values = [
            uuid(),
            verificationFlowHandler.getRequestUrl(),
            now,
            verificationFlowHandler.getExpiresAt().toUTCString(),
            uuid(),
            now,
            now,
            verificationFlowHandler.getType(),
            verificationFlowHandler.getState(),
            verificationFlowHandler.getActiveMethod(),
            verificationFlowHandler.getUI(),
            consts.NETWORK_ID
        ];
        pgKratosQueries.createVerificationFlow(values, result => {
            if(result.err || result.res.length == 0){
                return reject("Failed to create verification flow");
            }

            let selfServiceVerificationFlow = result.res;

            let id = selfServiceVerificationFlow.id;
            let active = selfServiceVerificationFlow.active_method;
            let expiresAt = selfServiceVerificationFlow.expires_at;
            let issuedAt = selfServiceVerificationFlow.issued_at;
            let requestUrl = selfServiceVerificationFlow.request_url;
            let messages = selfServiceVerificationFlow.ui.messages;
            let methods = selfServiceVerificationFlow.ui.method;
            let state = selfServiceVerificationFlow.state;
            let type = selfServiceVerificationFlow.type;

            resolve({
                active,
                expiresAt,
                id,
                issuedAt,
                messages,
                methods,
                requestUrl,
                state,
                type
            });
        });
        /*resolve({
            active: "active",
            expiresAt: "2022-01",
            id: "id2",
            issuedAt: "2022-02",
            messages: [{
                context: "api",
                id: 1,
                text: "update",
                type: "container"
            }],
            methods: "post",
            requestUrl: "/root",
            state: "active",
            type: "browser"
        });*/
    });
}

module.exports = async () => {
    return getData();
}
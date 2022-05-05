let {uuid} = require("uuidv4");
const pgKratosQueries = require('../../postgres/kratos-queries');
const recoveryFlowHandler = require('../../flows/recoveryFlowHandler');
const consts = require('../../libs/consts');
const getData = () => {
    return new Promise((resolve, reject) => {
        let now = new Date().toUTCString();
        const values = [
            uuid(),
            recoveryFlowHandler.getRequestUrl(),
            now,
            recoveryFlowHandler.getExpiresAt().toUTCString(),
            recoveryFlowHandler.getActiveMethod(),
            uuid(),
            recoveryFlowHandler.getState(),
            recoveryFlowHandler.getRecoveredIdentityId(),
            now,
            now,
            recoveryFlowHandler.getType(),
            JSON.stringify(recoveryFlowHandler.getUI()),
            consts.NETWORK_ID
        ];
        pgKratosQueries.createRecoveryFlow(values, result => {
            if(result.err || result.res.length == 0){
                return reject("Failed to create recovery flow");
            }

            let selfServiceRecoveryFlow = result.res;

            let id = selfServiceRecoveryFlow.id;
            let active = selfServiceRecoveryFlow.active_method;
            let expiresAt = selfServiceRecoveryFlow.expires_at;
            let issuedAt = selfServiceRecoveryFlow.issued_at;
            let requestUrl = selfServiceRecoveryFlow.request_url;
            let messages = selfServiceRecoveryFlow.ui.messages;
            let methods = selfServiceRecoveryFlow.ui.method;
            let state = selfServiceRecoveryFlow.state;
            let type = selfServiceRecoveryFlow.type;

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
    });
}

module.exports = async () => {
    return getData();
}
let {uuid} = require("uuidv4");
const pgKratosQueries = require('../../postgres/kratos-queries');
const loginFlowHandler = require('../../flows/loginFlowHandler');
const consts = require('../../libs/consts');
const getData = ({refresh}) => {
    return new Promise((resolve, reject) => {
        if(!refresh){
            refresh = false;
        }
        let now = new Date().toUTCString();
        const values = [
            uuid(),
            loginFlowHandler.getRequestUrl(),
            now,
            loginFlowHandler.getExpiresAt().toUTCString(),
            loginFlowHandler.getActiveMethod(),
            uuid(),
            now,
            now,
            refresh,
            loginFlowHandler.getType(),
            loginFlowHandler.getUI(),
            consts.NETWORK_ID,
            loginFlowHandler.getRequestedAal(),
            loginFlowHandler.getInternalContext()
        ];
        pgKratosQueries.createLoginFlow(values, result => {
            if(result.err || result.res.length == 0){
                return reject("Failed to create Login flow");
            }

            let selfServiceLoginFlow = result.res;

            let id = selfServiceLoginFlow.id;
            let active = selfServiceLoginFlow.active_method;
            let expiresAt = selfServiceLoginFlow.expires_at;
            let forced = selfServiceLoginFlow.forced;
            let issuedAt = selfServiceLoginFlow.issued_at;
            let requestUrl = selfServiceLoginFlow.request_url;
            let type = selfServiceLoginFlow.type;
            let ui = selfServiceLoginFlow.ui;

            resolve({
                active,
                expiresAt,
                forced,
                id,
                issuedAt,
                requestUrl,
                type,
                ui
            });
        });
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}
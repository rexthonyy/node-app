let { uuid } = require("uuidv4");
const pgKratosQueries = require('../postgres/kratos-queries');
const loginFlowHandler = require('../flows/loginFlowHandler');
const consts = require('./consts');

module.exports = (refresh, cb) => {
    if (!refresh) {
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
        JSON.stringify(loginFlowHandler.getUI()),
        consts.NETWORK_ID,
        loginFlowHandler.getRequestedAal(),
        JSON.stringify(loginFlowHandler.getInternalContext())
    ];
    pgKratosQueries.createLoginFlow(values, result => {
        if (result.err) {
            console.error(result.err);
            return cb("Failed to create Login flow");
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

        let appSession = {
            active,
            expiresAt,
            forced,
            id,
            issuedAt,
            requestUrl,
            type,
            ui
        };

        console.log(appSession);
        return cb(appSession);
    });
}
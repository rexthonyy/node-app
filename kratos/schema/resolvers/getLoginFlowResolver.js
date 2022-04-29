const pgKratosQueries = require('../../postgres/kratos-queries');
const util = require('../../libs/util');
const getData = ({refresh}) => {
    return new Promise((resolve, reject) => {
        let id = util.getSessionId();
        pgKratosQueries.getSelfServiceLoginFlowById([id], result => {
            if(result.err || result.res.length == 0){
                return reject("Login flow ID not found");
            }

            let selfServiceLoginFlow = result.res[0];

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
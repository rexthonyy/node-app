const pgKratosQueries = require('../../postgres/kratos-queries');
const util = require('../../libs/util');
const getData = ({refresh}) => {
    return new Promise((resolve, reject) => {
        let id = util.getSessionId();
        pgKratosQueries.getSelfServiceRecoveryFlowById([id], result => {
            if(result.err || result.res.length == 0){
                return reject("Recovery flow ID not found");
            }

            let selfServiceRecoveryFlow = result.res[0];

            let active = selfServiceRecoveryFlow.active_method;
            let expiresAt = selfServiceRecoveryFlow.expires_at;
            let issuedAt = selfServiceRecoveryFlow.issued_at;
            let requestUrl = selfServiceRecoveryFlow.request_url;
            let messages = [{
                context: "api",
                id: 1,
                text: "update",
                type: "container"
            }];
            let methods = "{}";
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

module.exports = async (parent, args) => {
    return getData(args);
}
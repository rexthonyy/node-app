const pgKratosQueries = require('../../postgres/kratos-queries');

const getData = ({id}) => {
    return new Promise((resolve, reject) => {
        pgKratosQueries.getSelfServiceRecoveryFlowById([id], result => {
            if(result.err || result.res.length == 0){
                return reject("Recovery flow ID not found");
            }

            let selfServiceRecoveryFlow = result.res[0];

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

module.exports = async (parent, args) => {
    return getData(args);
}
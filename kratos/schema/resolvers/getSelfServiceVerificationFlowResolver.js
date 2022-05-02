const pgKratosQueries = require('../../postgres/kratos-queries');

const getData = ({id}) => {
    return new Promise((resolve, reject) => {
        pgKratosQueries.getSelfServiceVerificationFlowById([id], result => {
            if(result.err || result.res.length == 0){
                return reject("Verification flow ID not found");
            }

            let selfServiceVerificationFlow = result.res[0];

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
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}
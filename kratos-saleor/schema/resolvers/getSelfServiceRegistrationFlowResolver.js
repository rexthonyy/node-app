const pgKratosQueries = require('../../postgres/kratos-queries');

const getData = ({id}) => {
    return new Promise((resolve, reject) => {

        pgKratosQueries.getSelfServiceRegistrationFlowById([id], result => {
            if(result.err || result.res.length == 0){
                return reject("Registration flow ID not found");
            }

            let selfServiceRecoveryFlow = result.res[0];

            let active = selfServiceRecoveryFlow.active_method;
            let expiresAt = selfServiceRecoveryFlow.expires_at;
            let issuedAt = selfServiceRecoveryFlow.issued_at;
            let requestUrl = selfServiceRecoveryFlow.request_url;
            let messages = selfServiceRecoveryFlow.ui.messages;
            let methods = selfServiceRecoveryFlow.ui.method;
            let type = selfServiceRecoveryFlow.type;

            if(expiresAt != null){
                let expireDate = new Date(expiresAt);
                active = Date.now() < expireDate.getTime();
            }

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
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}
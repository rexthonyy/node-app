const pgKratosQueries = require('../../postgres/kratos-queries');

const getData = ({id}) => {
    return new Promise((resolve, reject) => {

        pgKratosQueries.getSelfServiceRegistrationFlowById([id], result => {
            if(result.err){
                return reject("Registration flow ID not found");
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
            let type = selfServiceRecoveryFlow.type;

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
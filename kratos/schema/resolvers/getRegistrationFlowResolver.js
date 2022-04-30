const pgKratosQueries = require('../../postgres/kratos-queries');
const util = require('../../libs/util');
const getData = () => {
    return new Promise((resolve, reject) => {
        let id = util.getSessionId();
        pgKratosQueries.getSelfServiceRegistrationFlowById([id], result => {
            if(result.err || result.res.length == 0){
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
        /*
        resolve({
            active: "active",
            expiresAt: "2022-01",
            id: "12d",
            issuedAt: "2022-02",
            messages: [{
                context: "api",
                id: 1,
                text: "update",
                type: "container"
            }],
            methods: "post",
            requestUrl: "/root",
            type: "browser"
        });*/
    });
}

module.exports = async () => {
    return getData();
}
const pgKratosQueries = require('../../postgres/kratos-queries');
const util = require('../../libs/util');
const getData = () => {
    return new Promise((resolve, reject) => {
        let id = util.getSessionId();
        pgKratosQueries.getSelfServiceVerificationFlowById([id], result => {
            if(result.err || result.res.length == 0){
                return reject("Verification flow ID not found");
            }

            let selfServiceVerificationFlow = result.res[0];

            let active = selfServiceVerificationFlow.active_method;
            let expiresAt = selfServiceVerificationFlow.expires_at;
            let issuedAt = selfServiceVerificationFlow.issued_at;
            let requestUrl = selfServiceVerificationFlow.request_url;
            let messages = [{
                context: "api",
                id: 1,
                text: "update",
                type: "container"
            }];
            let methods = "{}";
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
        /*resolve({
            active: "active",
            expiresAt: "2022-01",
            id: "id2",
            issuedAt: "2022-02",
            messages: [{
                context: "api",
                id: 1,
                text: "update",
                type: "container"
            }],
            methods: "post",
            requestUrl: "/root",
            state: "active",
            type: "browser"
        });*/
    });
}

module.exports = async () => {
    return getData();
}
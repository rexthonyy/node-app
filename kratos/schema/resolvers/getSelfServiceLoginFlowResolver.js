const pgKratosQueries = require('../../postgres/kratos-queries');

const getData = ({id}) => {
    return new Promise((resolve, reject) => {
        pgKratosQueries.getSelfServiceLoginFlowById([id], result => {
            if(result.err){
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


//{"action": "active","messages": [{"context": "api","id": 1,"text": "update","type": "container"}],"method": "post","nodes": {"attributes": {"type": "attr"},"group": "one","messages": {"context": "api","id": 2,"text": "update","type": "container"},"type": "api"}}
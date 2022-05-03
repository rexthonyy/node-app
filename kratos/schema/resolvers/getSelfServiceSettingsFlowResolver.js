const pgKratosQueries = require('../../postgres/kratos-queries');
const getIdentityById = require('../resolverUtils/getIdentityById');

const getData = ({id}) => {
    return new Promise((resolve, reject) => {
        pgKratosQueries.getSelfServiceSettingsFlowById([id], result => {
            if(result.err || result.res.length == 0){
                return reject("Settings flow ID not found");
            }

            let selfServiceSettingsFlow = result.res[0];

            let active = selfServiceSettingsFlow.active_method;
            let expiresAt = selfServiceSettingsFlow.expires_at;
            let issuedAt = selfServiceSettingsFlow.issued_at;
            let requestUrl = selfServiceSettingsFlow.request_url;
            let identityId = selfServiceSettingsFlow.identity_id;
            let messages = selfServiceSettingsFlow.ui.messages;
            let methods = selfServiceSettingsFlow.ui.method;
            let state = selfServiceSettingsFlow.state;
            let type = selfServiceSettingsFlow.type;

            getIdentityById(identityId, identity => {
                if(typeof identity == "string"){
                    return reject(identity);
                }

                resolve({
                    active,
                    expiresAt,
                    id,
                    identity,
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
                id: id,
                identity: "identity"+id,
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
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}
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

            if(expiresAt != null){
                let expireDate = new Date(expiresAt);
                active = Date.now() < expireDate.getTime();
            }

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
        });
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}
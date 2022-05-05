const { IDENTITY_CREDENTIAL_TYPE_PASSWORD } = require('../../libs/consts');
const pgKratosQueries = require('../../postgres/kratos-queries');
const getIdentityById = require('../resolverUtils/getIdentityById');

const getData = ({flow, completeSelfServiceSettingsFlowWithPasswordMethodInput}) => {
    return new Promise((resolve, reject) => {
        let password = completeSelfServiceSettingsFlowWithPasswordMethodInput.password;

        pgKratosQueries.getSelfServiceSettingsFlowById([flow], result => {
            if(result.err || result.res.length == 0){
                return reject("Settings flow ID not found");
            }

            let selfServiceSettingsFlow = result.res[0];

            let id = selfServiceSettingsFlow.id;
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
                
                const settingsFlow = {
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
                };

                if(expiresAt != null){
                    let expireDate = new Date(expiresAt);
                    if(Date.now() > expireDate.getTime()){
                        return reject("Settings Flow ID expired");
                    }
                }

                pgKratosQueries.getIdentityCredentialsByIdentityCredentialTypeIdAndIdentityId([IDENTITY_CREDENTIAL_TYPE_PASSWORD, identityId], result1 => {
                    if(result1.err || result1.res.length == 0){
                        return reject("Identity credential not found");
                    }

                    let identityCredential = result1.res[0];
                    let identityCredentialId = identityCredential.id;
                    let config = identityCredential.config;
                    config.password = password;

                    let now = new Date().toUTCString();

                    let values = [
                        identityCredentialId,
                        config,
                        now
                    ];
                    pgKratosQueries.updateIdentityCredentials(values, result2 => {
                        if(result2.err){
                            console.error(result2.err);
                            return reject("Identity credential could not be updated");
                        }

                        resolve({
                            flow: settingsFlow,
                            identity
                        });
                    });
                });
            });
        });
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}
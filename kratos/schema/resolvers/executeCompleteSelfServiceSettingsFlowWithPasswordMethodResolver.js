const { IDENTITY_CREDENTIAL_TYPE_PASSWORD } = require('../../libs/consts');
const pgKratosQueries = require('../../postgres/kratos-queries');
const getIdentityById = require('../resolverUtils/getIdentityById');

const getData = ({flow, completeSelfServiceSettingsFlowWithPasswordMethodInput}) => {
    return new Promise((resolve, reject) => {
        let csrfToken = completeSelfServiceSettingsFlowWithPasswordMethodInput.csrfToken;
        let password = completeSelfServiceSettingsFlowWithPasswordMethodInput.password;

        pgKratosQueries.getSelfServiceSettingsFlowById([flow], result => {
            if(result.err || result.res.length == 0){
                return reject("Settings flow ID not found");
            }

            let selfserviceSettingsFlow = result.res[0];

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

                pgKratosQueries.getIdentityCredentialsByIdentityCredentialTypeIdAndIdentityId([IDENTITY_CREDENTIAL_TYPE_PASSWORD, identityId], result => {
                    if(result.err || result.res.length == 0){
                        return reject("Identity credential not found");
                    }

                    let identityCredential = result.res[0];
                    let identityCredentialId = identityCredential.id;
                    let config = identityCredential.config;
                    config.password = password;

                    let now = new Date().toUTCString();

                    let values = [
                        identityCredentialId,
                        config,
                        now
                    ];
                    pgKratosQueries.updateIdentityCredentials(values, result => {
                        if(result.err){
                            console.error(result.err);
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
        /*resolve({
            flow: {
                active: "true",
                expiresAt: "202232",
                id: "202232",
                identity: { 
                    id: "202232",
                    recoveryAddresses: [{ 
                        id: "202232",
                        value: "202232",
                        via: "api"
                     }],
                    schemaId: "202232",
                    schemaUrl: "/root",
                    traits: "202232",
                    verifiableAddresses: [{  
                        id: "202232",
                        status: "pending",
                        value: "202232",
                        verified: true,
                        verifiedAt: "202232",
                        via: "api",
                    }]
                },
                issuedAt: "202232",
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
            },
            identity: { 
                id: "202232",
                recoveryAddresses: [{ 
                    id: "202232",
                    value: "202232",
                    via: "api"
                 }],
                schemaId: "202232",
                schemaUrl: "/root",
                traits: "202232",
                verifiableAddresses: [{  
                    id: "202232",
                    status: "pending",
                    value: "202232",
                    verified: true,
                    verifiedAt: "202232",
                    via: "api",
                }]
            }
        });*/
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}
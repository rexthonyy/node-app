var Validator = require('jsonschema').Validator;
var v = new Validator();
const pgKratosQueries = require('../../postgres/kratos-queries');
const getIdentityById = require('../resolverUtils/getIdentityById');
const schemaHandler = require('../../identities/schemaHandler');

const getData = ({flow, selfServiceSettingsMethodsProfileInput}) => {
    return new Promise((resolve, reject) => {
        let traits = JSON.parse(selfServiceSettingsMethodsProfileInput);

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

                let schemaId = identity.schemaId;
                let identitySchema = schemaHandler.getJSONSchemaById(schemaId);
                let errors = v.validate(traits,identitySchema).errors
                if(errors.length > 0){
                    return reject(JSON.stringify(errors));
                }

                let now = new Date().toUTCString();
                let values = [
                    identityId,
                    schemaId,
                    traits,
                    now
                ];
                pgKratosQueries.updateIdentity(values, result => {
                    if(result.err || result.res.length == 0){
                        return reject("Identity could not be updated");
                    }

                    resolve(settingsFlow);
                });
            });
        });

        /*resolve({
            active: "active",
            expiresAt: "2022-01",
            id: "id-1",
            identity: "identity",
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

module.exports = async (parent, args) => {
    return getData(args);
}
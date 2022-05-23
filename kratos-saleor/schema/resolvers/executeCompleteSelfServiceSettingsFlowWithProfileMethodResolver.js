var Validator = require('jsonschema').Validator;
var v = new Validator();
const pgKratosQueries = require('../../postgres/kratos-queries');
const getIdentityById = require('../resolverUtils/getIdentityById');
const schemaHandler = require('../../identities/schemaHandler');

const getData = ({flow, selfServiceSettingsMethodsProfileInput}) => {
    return new Promise((resolve, reject) => {
        let traits = JSON.parse(selfServiceSettingsMethodsProfileInput);

        checkSettingsFlow(resolve, reject, flow, traits);
    });
}

function checkSettingsFlow(resolve, reject, flow, traits){
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

        if(expiresAt != null){
            let expireDate = new Date(expiresAt);
            if(Date.now() > expireDate.getTime()){
                return reject("Settings Flow ID expired");
            }
        }

        getIdentityAndValidateIdentitySchema(resolve, reject, traits, {
            id,
            active,
            expiresAt,
            issuedAt,
            requestUrl,
            identityId,
            messages,
            methods,
            state,
            type
        });
    });
}

function getIdentityAndValidateIdentitySchema(resolve, reject, traits, f){
    getIdentityById(f.identityId, identity => {
        if(typeof identity == "string"){
            return reject(identity);
        }

        let schemaId = identity.schemaId;
        let identitySchema = JSON.parse(schemaHandler.getJSONSchemaById(schemaId));
        let errors = v.validate(traits,identitySchema).errors
        if(errors.length > 0){
            return reject(JSON.stringify(errors));
        }

        UpdateIdentity(resolve, reject, traits, f);
    });
}

function UpdateIdentity(resolve, reject, traits, f){
    let now = new Date().toUTCString();
    let values = [
        f.identityId,
        schemaId,
        traits,
        now
    ];
    pgKratosQueries.updateIdentity(values, result1 => {
        if(result1.err || result1.res.length == 0){
            return reject("Identity could not be updated");
        }

        getIdentityById(f.identityId, identity_ => {
            if(typeof identity_ == "string"){
                return reject(identity_);
            }
            
            const settingsFlow = {
                active: f.active,
                expiresAt: f.expiresAt,
                id: f.id,
                identity: identity_,
                issuedAt: f.issuedAt,
                messages: f.messages,
                methods: f.methods,
                requestUrl: f.requestUrl,
                state: f.state,
                type: f.type
            };

            resolve(settingsFlow);

        });
    });
}
module.exports = async (parent, args) => {
    return getData(args);
}
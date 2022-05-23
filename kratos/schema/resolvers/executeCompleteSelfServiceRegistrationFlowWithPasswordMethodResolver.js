var Validator = require('jsonschema').Validator;
var v = new Validator();
const {uuid} = require('uuidv4');
const pgKratosQueries = require('../../postgres/kratos-queries');
const getIdentityById = require('../resolverUtils/getIdentityById');
const schemaHandler = require('../../identities/schemaHandler');
const sessionHandler = require('../../identities/sessionHandler');
const {isEmailValid} = require('../../libs/util');
const { NETWORK_ID, IDENTITY_CREDENTIAL_TYPE_PASSWORD } = require('../../libs/consts');
const getData = ({flow, selfServiceRegistrationMethodsPasswordInput}) => {
    return new Promise((resolve, reject) => {
        let traits = JSON.parse(selfServiceRegistrationMethodsPasswordInput);

        if(!isEmailValid(traits.email)){
            return reject("Email is not valid");
        }
        
        checkRegistrationFlow(resolve, reject, flow, traits);
    });
}

function checkRegistrationFlow(resolve, reject, flow, traits){
    pgKratosQueries.getRegistrationFlowById([flow], result => {
        if(result.err || result.res.length == 0){
            return reject("Flow ID not found");
        }

        let registrationFlow = result.res[0];
        let expiresAt = registrationFlow.expires_at;

        if(expiresAt != null){
            let expireDate = new Date(expiresAt);
            if(Date.now() > expireDate.getTime()){
                return reject("Flow ID expired");
            }
        }

        let identitySchema = JSON.parse(schemaHandler.getDefaultJSONSchema());            
        let errors = v.validate(traits,identitySchema).errors;
        if(errors.length > 0){
            return reject(JSON.stringify(errors));
        }

        getIdentityCredentials(resolve, reject, traits);
    });
}

function getIdentityCredentials(resolve, reject, traits){
    pgKratosQueries.getIdentityCredentialsByIdentityCredentialTypeId([IDENTITY_CREDENTIAL_TYPE_PASSWORD], result1 => {
        if(result1.err || result1.res.length == 0){
            console.log(result1.err);
            createIdentity(resolve, reject, traits);
        }else{
            let identityCredentials = result1.res;
            let numIdentityCredentials = identityCredentials.length;
            let count = -1;

            identityCredentials.forEach(identityCredential => {
                pgKratosQueries.getIdentityCredentialIdentifierByIdentityCredentialIdAndIdentityCredentialTypeId([identityCredential.id, IDENTITY_CREDENTIAL_TYPE_PASSWORD], result2 => {
                    let identityCredentialIdentifier = result2.res[0];
                    if(identityCredentialIdentifier.identifier == traits.email){
                        return reject("Email is already registered");
                    }

                    checkComplete();
                });
            });

            checkComplete();

            function checkComplete(){
                count++;
                if(count == numIdentityCredentials){
                    createIdentity(resolve, reject, traits);
                }
            }
        }
    });

}

function createIdentity(resolve, reject, traits){
    let now = new Date().toUTCString();
    let values = [
        uuid(),
        schemaHandler.getDefaultJSONSchemaId(),
        JSON.stringify(traits),
        now,
        now,
        NETWORK_ID,
        "active",
        now
    ];
    pgKratosQueries.createIdentity(values, result3 => {
        if(result3.err){
            console.error(result3.err);
            return reject("Identity could not be created");
        }

        let identityId = result3.res.id;

        createIdentityCredential(resolve, reject, traits, identityId);
    });
}

function createIdentityCredential(resolve, reject, traits, identityId){
    let config = {
        password: traits.password
    };

    let now = new Date().toUTCString();
    let values = [
        uuid(),
        JSON.stringify(config),
        IDENTITY_CREDENTIAL_TYPE_PASSWORD,
        identityId,
        now,
        now,
        NETWORK_ID
    ];
    pgKratosQueries.createIdentityCredentials(values, result4 => {
        if(result4.err){
            console.error(result4.err);
            return reject("Identity credentials could not be created");
        }

        let identityCredentialId = result4.res.id;

        createIdentityCredentialIdentifier(resolve, reject, traits, identityId, identityCredentialId);
    });
}

function createIdentityCredentialIdentifier(resolve, reject, traits, identityId, identityCredentialId){
    let identifier = traits.email;

    let now = new Date().toUTCString();
    let values = [
        uuid(),
        identifier,
        identityCredentialId,
        now,
        now,
        NETWORK_ID,
        IDENTITY_CREDENTIAL_TYPE_PASSWORD
    ];

    pgKratosQueries.createIdentityCredentialIdentifier(values, result5 => {
        if(result5.err){
            console.error(result5.err);
            return reject("Identity credential identifier could not be created");
        }

        createSession(resolve, reject, identityId);
    });
}

function createSession(resolve, reject, identityId){
    let now = new Date().toUTCString();
    let values = [
        uuid(),
        now,
        sessionHandler.getExpiresAt().toUTCString(),
        now,
        identityId,
        now,
        now,
        sessionHandler.generateToken(),
        true,
        NETWORK_ID,
        sessionHandler.generateLogoutToken(),
        sessionHandler.getRequestedAal(),
        JSON.stringify(sessionHandler.getAuthenticationMethods())
    ];
    pgKratosQueries.createSession(values, result6 => {
        if(result6.err){
            console.error(result6.err);
            return reject("Failed to create session");
        }

        let session = result6.res;

        getIdentityOutputType(resolve, reject, identityId, session);
    });
}

function getIdentityOutputType(resolve, reject, identityId, session){
    let active = session.active;
    let authenticatedAt = session.authenticated_at;
    let expiresAt = session.expires_at;
    let id = session.id;
    let issuedAt = session.issued_at;
    let sessionToken = session.token;

    getIdentityById(identityId, identity => {
        if(typeof identity == "string"){
            return reject(identity);
        }

        resolve({
            identity,
            session: {
                active,
                authenticatedAt,
                expiresAt,
                id,
                identity,
                issuedAt
            },
            sessionToken
        });
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}
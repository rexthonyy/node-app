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

            let identitySchema = schemaHandler.getDefaultJSONSchema();
            console.log(identitySchema);
            console.log(traits);
            let errors = v.validate(traits,identitySchema).errors
            if(errors.length > 0){
                return reject(JSON.stringify(errors));
            }

            pgKratosQueries.getIdentityCredentialsByIdentityCredentialTypeId([IDENTITY_CREDENTIAL_TYPE_PASSWORD], result => {
                if(result.err || result.res.length == 0){
                    createIdentity();
                }else{
                    let identityCredentials = result.res;
                    let numIdentityCredentials = identityCredentials.length;
                    let count = -1;
    
                    identityCredentials.forEach(identityCredential => {
                        pgKratosQueries.getIdentityCredentialIdentifierByIdentityCredentialIdAndIdentityCredentialTypeId([identityCredential.id, IDENTITY_CREDENTIAL_TYPE_PASSWORD], result => {
                            let identityCredentialIdentifier = result.res[0];
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
                            createIdentity();                           
                        }
                    }
                }
            });

            function createIdentity(){
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
                pgKratosQueries.createIdentity(values, result => {
                    if(result.err){
                        console.error(result.err);
                        return reject("Identity could not be created");
                    }
    
                    let identityId = result.res.id;
    
                    let config = {
                        password: traits.password
                    };
    
                    values = [
                        uuid(),
                        JSON.stringify(config),
                        IDENTITY_CREDENTIAL_TYPE_PASSWORD,
                        identityId,
                        now,
                        now,
                        NETWORK_ID
                    ];
                    pgKratosQueries.createIdentityCredentials(values, result => {
                        if(result.err){
                            console.error(result.err);
                            return reject("Identity credentials could not be created");
                        }
    
                        let identityCredentialId = result.res.id;
    
                        let identifier = traits.email;
    
                        values = [
                            uuid(),
                            identifier,
                            identityCredentialId,
                            now,
                            now,
                            NETWORK_ID,
                            IDENTITY_CREDENTIAL_TYPE_PASSWORD
                        ];
                        pgKratosQueries.createIdentityCredentialIdentifier(values, result => {
                            if(result.err){
                                console.error(result.err);
                                return reject("Identity credential identifier could not be created");
                            }
    
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
                            pgKratosQueries.createSession(values, result => {
                                if(result.err){
                                    console.error(result.err);
                                    return reject("Failed to create session");
                                }
    
                                let session = result.res;
    
                                let active = session.active;
                                let authenticatedAt = session.authenticated_at;
                                expiresAt = session.expires_at;
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
                            });
                        });
                    });
                });
            }
        });
        /*resolve({
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
            session: {
                active: true,
                authenticatedAt: "2022-01-32",
                expiresAt: "2022-01-32",
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
            },
            sessionToken: "2022-01-3234242"
        });*/
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}
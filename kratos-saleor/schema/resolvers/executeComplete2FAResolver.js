const {uuid} = require('uuidv4');
const { authenticator } = require('otplib');
const pgKratosQueries = require('../../postgres/kratos-queries');
const getIdentityById = require('../resolverUtils/getIdentityById');
const { getVia } = require('../../identities/identityRecoveryAddressHandler');
const {NETWORK_ID,IDENTITY_CREDENTIAL_TYPE_PASSWORD} = require('../../libs/consts');
const sessionHandler = require('../../identities/sessionHandler');

const getData = ({authenticationData}) => {
    return new Promise((resolve, reject) => {
        const authData = JSON.parse(authenticationData);
        let code = authData.code;
        let flow = authData.flow;
        let identifier = authData.identifier;
        let password  = authData.password;

        checkLoginFlow(resolve, reject, code, flow, identifier, password);
    });
}

function checkLoginFlow(resolve, reject, code, flow, identifier, password){
    pgKratosQueries.getLoginFlowById([flow], result => {
        if(result.err || result.res.length == 0){
            return reject("Flow ID not found");
        }

        let loginFlow = result.res[0];
        let expiresAt = loginFlow.expires_at;

        if(expiresAt != null){
            let expireDate = new Date(expiresAt);
            if(Date.now() > expireDate.getTime()){
                return reject("Flow ID expired");
            }
        }

        getIdentityCredentialsTypes(resolve, reject, code, identifier, password);
    });
}

function getIdentityCredentialsTypes(resolve, reject, code, identifier, password){
    pgKratosQueries.getIdentityCredentialsByIdentityCredentialTypeId([IDENTITY_CREDENTIAL_TYPE_PASSWORD], result1 => {
        if(result1.err || result1.res.length == 0){
            return reject("Identity credentials not found");
        }
        let identityCredentials = result1.res;
        let numIdentityCredentials = identityCredentials.length;
        let count = -1;
        let loggedInIdentityCredential;
        let identity;
        let secret;

        identityCredentialsIterator(identityCredentials, identifier, password, res => {
            if(res) {
                loggedInIdentityCredential = res.identityCredential;
                identity = res.identity;
                secret = res.secret;
            }
            checkComplete();
        });

        checkComplete();

        function checkComplete(){
            count++;
            if(count == numIdentityCredentials){
                if(!loggedInIdentityCredential){
                    return reject("Identity credentials invalid");
                }
                
                let traits = JSON.parse(identity.traits);
                if(traits.settings && traits.settings.is2FA && traits.settings.is2FA == true ){
                    if(!authenticator.check(code, secret)){
                        return reject("Try again, authentication failed");
                    }else{
                        createSession(resolve, reject, loggedInIdentityCredential);
                    }
                }else{
                    createSession(resolve, reject, loggedInIdentityCredential);
                }
            }
        }
    });
}

function identityCredentialsIterator(identityCredentials, identifier, password, cb){
    let res;
    identityCredentials.forEach(identityCredential => {
        pgKratosQueries.getIdentityCredentialIdentifierByIdentityCredentialIdAndIdentityCredentialTypeId([identityCredential.id, IDENTITY_CREDENTIAL_TYPE_PASSWORD], result2 => {
            let identityCredentialIdentifier = result2.res[0];
            if(identityCredentialIdentifier.identifier == identifier){
                if(identityCredential.config.password == password){
                    getIdentityById(identityCredential.identity_id, identity => {
                        if(typeof identity == "string"){
                            return reject(identity);
                        }
                        
                        res = {
                            identityCredential,
                            identity,
                            secret: identityCredential.config.secret  
                        };

                        cb(res);
                    });
                }else{
                    cb(res);
                }
            }else{
                cb(res);
            }
        });
    });
}

function createSession(resolve, reject, identityCredential){
    let now = new Date().toUTCString();
    let values = [
        uuid(),
        now,
        sessionHandler.getExpiresAt().toUTCString(),
        now,
        identityCredential.identity_id,
        now,
        now,
        sessionHandler.generateToken(),
        true,
        NETWORK_ID,
        sessionHandler.generateLogoutToken(),
        sessionHandler.getRequestedAal(),
        JSON.stringify(sessionHandler.getAuthenticationMethods())
    ];
    pgKratosQueries.createSession(values, result3 => {
        if(result3.err){
            return reject("Failed to create session");
        }

        let session = result3.res;

        let active = session.active;
        let authenticatedAt = session.authenticated_at;
        let expiresAt = session.expires_at;
        let id = session.id;
        let identityId = session.identity_id;
        let issuedAt = session.issued_at;
        let sessionToken = session.token;

        getIdentityById(identityId, identity => {
            if(typeof identity == "string"){
                return reject(identity);
            }

            resolve({
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
}

module.exports = async (parent, args) => {
    return getData(args);
}
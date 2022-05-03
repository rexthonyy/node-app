const {uuid} = require('uuidv4');
const pgKratosQueries = require('../../postgres/kratos-queries');
const getIdentityById = require('../resolverUtils/getIdentityById');
const {NETWORK_ID,IDENTITY_CREDENTIAL_TYPE_PASSWORD} = require('../../libs/consts');
const {getSessionExpirationTime, generateToken} = require('../../libs/util');
const getData = ({completeSelfServiceLoginFlowWithPasswordMethodInput, flow}) => {
    return new Promise((resolve, reject) => {
        let csrfToken = completeSelfServiceLoginFlowWithPasswordMethodInput.csrfToken;
        let identifier = completeSelfServiceLoginFlowWithPasswordMethodInput.identifier;
        let password  = completeSelfServiceLoginFlowWithPasswordMethodInput.password;


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

            pgKratosQueries.getIdentityCredentialsByIdentityCredentialTypeId([IDENTITY_CREDENTIAL_TYPE_PASSWORD], result => {
                if(result.err || result.res.length == 0){
                    return reject("Identity credentials not found");
                }
                let identityCredentials = result.res;
                let numIdentityCredentials = identityCredentials.length;
                let count = -1;
                let loggedInIdentityCredential;

                identityCredentials.forEach(identityCredential => {
                    pgKratosQueries.getIdentityCredentialIdentifierByIdentityCredentialIdAndIdentityCredentialTypeId([identityCredential.id, IDENTITY_CREDENTIAL_TYPE_PASSWORD], result => {
                        let identityCredentialIdentifier = result.res[0];
                        if(identityCredentialIdentifier.identifier == identifier){
                            if(identityCredential.config.password == password){
                                loggedInIdentityCredential = identityCredential;
                            }
                        }

                        checkComplete();
                    });
                });

                checkComplete();

                function checkComplete(){
                    count++;
                    if(count == numIdentityCredentials){
                        if(!loggedInIdentityCredential){
                            return reject("Identity credentials invalid");
                        }

                        let now = new Date().toUTCString();
                        let token = generateToken(30);
                        let values = [
                            uuid(),
                            now,
                            getSessionExpirationTime().toUTCString(),
                            now,
                            loggedInIdentityCredential.identity_id,
                            now,
                            now,
                            token,
                            true,
                            NETWORK_ID,
                            token,
                            'aal1',
                            '{"method":"password"}'
                        ];
                        pgKratosQueries.createSession(values, result => {
                            if(result.err){
                                return reject("Failed to create session");
                            }

                            let session = result.res;

                            let active = session.active;
                            let authenticatedAt = session.authenticated_at;
                            let expiresAtt = session.expires_at;
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
                                        expiresAtt,
                                        id,
                                        identity,
                                        issuedAt
                                    },
                                    sessionToken
                                });
                            });
                        });
                    }
                }
            });
        });
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}
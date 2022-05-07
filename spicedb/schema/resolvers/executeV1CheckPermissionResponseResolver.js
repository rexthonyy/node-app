const {uuid} = require('uuidv4');
const pgKratosQueries = require('../../postgres/spicedb-queries');

const getData = ({v1CheckPermissionRequestInput}) => {
    return new Promise((resolve, reject) => {
        let consistency = v1CheckPermissionRequestInput.consistency;
        let permission = v1CheckPermissionRequestInput.permission;
        let resource = v1CheckPermissionRequestInput.resource;
        let subject = v1CheckPermissionRequestInput.subject;

        let atExactSnapshot = consistency.atExactSnapshot;
        let atLeastAsFresh = consistency.atLeastAsFresh;
        let fullyConsistent = consistency.fullyConsistent;
        let minimizeLatency = consistency.minimizeLatency;

        let atExactSnapshot_token = atExactSnapshot.token;
        let atLeastAsFresh_token = atLeastAsFresh.token;
        
        let resource_objectId = resource.objectId;
        let resource_objectType = resource.objectType;

        let object = subject.object;
        let optionalRelation = subject.optionalRelation;

        let object_objectId = object.objectId;
        let object_objectType = object.objectType;

        checkLoginFlow(resolve, reject, flow, identifier, password);
    });
}

function checkLoginFlow(resolve, reject, flow, identifier, password){
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

        getIdentityCredentialsTypes(resolve, reject, identifier, password);
    });
}

function getIdentityCredentialsTypes(resolve, reject, identifier, password){
    pgKratosQueries.getIdentityCredentialsByIdentityCredentialTypeId([IDENTITY_CREDENTIAL_TYPE_PASSWORD], result1 => {
        if(result1.err || result1.res.length == 0){
            return reject("Identity credentials not found");
        }
        let identityCredentials = result1.res;
        let numIdentityCredentials = identityCredentials.length;
        let count = -1;
        let loggedInIdentityCredential;

        identityCredentialsIterator(identityCredentials, identifier, password, credential => {
            if(credential) loggedInIdentityCredential = credential;
            checkComplete();
        });

        checkComplete();

        function checkComplete(){
            count++;
            if(count == numIdentityCredentials){
                if(!loggedInIdentityCredential){
                    return reject("Identity credentials invalid");
                }

                createSession(resolve, reject, loggedInIdentityCredential);
            }
        }
    });
}

function identityCredentialsIterator(identityCredentials, identifier, password, cb){
    let loggedInIdentityCredential;
    identityCredentials.forEach(identityCredential => {
        pgKratosQueries.getIdentityCredentialIdentifierByIdentityCredentialIdAndIdentityCredentialTypeId([identityCredential.id, IDENTITY_CREDENTIAL_TYPE_PASSWORD], result2 => {
            let identityCredentialIdentifier = result2.res[0];
            if(identityCredentialIdentifier.identifier == identifier){
                if(identityCredential.config.password == password){
                    loggedInIdentityCredential = identityCredential;
                }
            }

            cb(loggedInIdentityCredential);
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
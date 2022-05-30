const { uuid } = require('uuidv4');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const pgKratosQueries = require('../../postgres/kratos-queries');
const getIdentityById = require('../resolverUtils/getIdentityById');
const { NETWORK_ID, IDENTITY_CREDENTIAL_TYPE_PASSWORD, expiresIn } = require('../../libs/consts');
const sessionHandler = require('../../identities/sessionHandler');

const getData = ({ email, password }) => {
    return new Promise((resolve, reject) => {

        if (password.length <= 5) {
            return resolve({
                csrfToken: "",
                token: "",
                errors: [{
                    message: "Password must be 6 or more characters",
                    __typename: "CreateToken"
                }],
                user: null,
                __typename: "CreateToken"
            });
        }

        fetch(process.env.SALEOR_GRAPHQL_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: `
                    mutation CreateToken($email: String!, $password: String!) {
                        tokenCreate(email: $email, password: $password) {
                        token
                        refreshToken
                        csrfToken
                        user {
                            email
                        }
                        errors {
                            field
                            message
                        }
                        }
                    }
                `,
                    variables: {
                        email,
                        password
                    }
                })
            })
            .then((res) => res.json())
            .then(result => {
                console.log(result);
                getIdentityCredentialsTypes(resolve, reject, email, password);
            });
    });
}

function getIdentityCredentialsTypes(resolve, reject, identifier, password) {
    pgKratosQueries.getIdentityCredentialsByIdentityCredentialTypeId([IDENTITY_CREDENTIAL_TYPE_PASSWORD], result1 => {
        if (result1.err || result1.res.length == 0) {
            return resolve({
                csrfToken: "",
                token: "",
                errors: [{
                    message: "Identity credentials not found",
                    __typename: "CreateToken"
                }],
                user: null,
                __typename: "CreateToken"
            });
        }
        let identityCredentials = result1.res;
        let numIdentityCredentials = identityCredentials.length;
        let count = -1;
        let loggedInIdentityCredential;
        let identity;

        identityCredentialsIterator(identityCredentials, identifier, password, res => {
            if (res) {
                loggedInIdentityCredential = res.identityCredential;
                identity = res.identity;
            }
            checkComplete();
        });

        checkComplete();

        function checkComplete() {
            count++;
            if (count == numIdentityCredentials) {
                if (!loggedInIdentityCredential) {
                    return resolve({
                        csrfToken: "",
                        token: "",
                        errors: [{
                            message: "Identity credentials invalid",
                            __typename: "CreateToken"
                        }],
                        user: null,
                        __typename: "CreateToken"
                    });
                }

                let traits = JSON.parse(identity.traits);
                if (traits.settings && traits.settings.is2FA && traits.settings.is2FA == true) {
                    return resolve({
                        csrfToken: "",
                        token: "",
                        errors: [{
                            code: "two-factor-authentication-required",
                            message: "Two factor authentication failed",
                            __typename: "CreateToken"
                        }],
                        user: null,
                        __typename: "CreateToken"
                    });
                } else {
                    createSession(resolve, reject, loggedInIdentityCredential);
                }
            }
        }
    });
}

function identityCredentialsIterator(identityCredentials, identifier, password, cb) {
    let res;
    identityCredentials.forEach(identityCredential => {
        pgKratosQueries.getIdentityCredentialIdentifierByIdentityCredentialIdAndIdentityCredentialTypeId([identityCredential.id, IDENTITY_CREDENTIAL_TYPE_PASSWORD], result2 => {
            let identityCredentialIdentifier = result2.res[0];
            if (identityCredentialIdentifier.identifier == identifier) {
                if (identityCredential.config.password == password) {
                    getIdentityById(identityCredential.identity_id, identity => {
                        if (typeof identity == "string") {
                            return resolve({
                                csrfToken: "",
                                token: "",
                                errors: [{
                                    message: identity,
                                    __typename: "CreateToken"
                                }],
                                user: null,
                                __typename: "CreateToken"
                            });
                        }

                        res = {
                            identityCredential,
                            identity,
                            secret: identityCredential.config.secret
                        };

                        cb(res);
                    });
                } else {
                    cb(res);
                }
            } else {
                cb(res);
            }
        });
    });
}

function createSession(resolve, reject, identityCredential) {
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
        if (result3.err) {
            return resolve({
                csrfToken: "",
                token: "",
                errors: [{
                    code: "failed-to-create-session",
                    message: "Failed to create session",
                    __typename: "CreateToken"
                }],
                user: null,
                __typename: "CreateToken"
            });
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
            if (typeof identity == "string") {
                return resolve({
                    csrfToken: "",
                    token: "",
                    errors: [{
                        code: "failed-to-fetch-identity",
                        message: identity,
                        __typename: "CreateToken"
                    }],
                    user: null,
                    __typename: "CreateToken"
                });
            }

            let selfServiceUserLogin = {
                session: {
                    active,
                    authenticatedAt,
                    expiresAt,
                    id,
                    identity,
                    issuedAt
                },
                sessionToken
            };

            let token = jwt.sign(selfServiceUserLogin, process.env.ACCESS_TOKEN_SECRET, { expiresIn: expiresIn });

            let user = JSON.parse(identity.traits);

            return resolve({
                csrfToken: sessionToken,
                token,
                errors: [],
                user: {
                    id: identityId,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isStaff: user.isStaff,
                    __typename: "CreateToken"
                },
                __typename: "CreateToken"
            });
        });
    });
}

module.exports = async(parent, args) => {
    return getData(args);
}
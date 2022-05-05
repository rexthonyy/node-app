const pgKratosQueries = require('../../postgres/kratos-queries');
const getIdentityById = require('../resolverUtils/getIdentityById');

const getData = ({authorization, cookie}) => {
    return new Promise((resolve, reject) => {
        if(!(authorization || cookie)){
            return reject("Please provide an authorization token");
        }
        let token;
        if(cookie){
            token = cookie;
        }
        if(authorization){
            token = authorization;
        }

        pgKratosQueries.getSessionByToken([token], result => {
            if(result.err || result.res.length == 0){
                return reject("Invalid authorization token");
            }

            let session = result.res[0];

            let active = session.active;
            let authenticatedAt = session.authenticated_at;
            let expiresAt = session.expires_at;
            let id = session.id;
            let issuedAt = session.issued_at;

            if(expiresAt != null){
                let expireDate = new Date(expiresAt);
                active = Date.now() < expireDate.getTime();
            }

            getIdentityById(session.identity_id, identity => {
                resolve({
                    active,
                    authenticatedAt,
                    expiresAt,
                    id,
                    identity,
                    issuedAt
                });
            });
        });
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}
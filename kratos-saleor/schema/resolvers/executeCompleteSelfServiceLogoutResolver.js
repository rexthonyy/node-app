const pgKratosQueries = require('../../postgres/kratos-queries');
const getIdentityById = require('../resolverUtils/getIdentityById');

const getData = ({ logoutToken }) => {
    return new Promise((resolve, reject) => {
        if (!logoutToken) {
            return reject("Please provide an authorization token");
        }
        let token = logoutToken;

        pgKratosQueries.updateSessionByLogoutToken([token, false], result => {
            if (result.err || result.res.length == 0) {
                return reject("Invalid authorization token");
            }

            let session = result.res[0];

            let active = session.active;
            let authenticatedAt = session.authenticated_at;
            let expiresAt = session.expires_at;
            let id = session.id;
            let issuedAt = session.issued_at;

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

module.exports = async(parent, args) => {
    return getData(args);
}
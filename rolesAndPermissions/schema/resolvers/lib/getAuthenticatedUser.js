const pgKratosQueries = require('../../../postgres/kratos-queries');
const getIdentityById = require('./getIdentityById');

let getAuthenticatedUser = (context, cb) => {
    const token = context.header["token"];
    pgKratosQueries.getSessionByToken([token], result => {
        if (result.err || result.res.length == 0) {
            return cb(null);
        }

        let session = result.res[0];

        if (!session.active) {
            return cb(null);
        }

        getIdentityById(session.identity_id, identity => {
            if (typeof identity == "string") {
                return cb(null);
            } else {
                cb(identity.traits);
            }
        });
    });
}

module.exports = getAuthenticatedUser;
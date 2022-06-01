const pgKratosQueries = require('../../../postgres/kratos-queries');

let getIdentityById = (identityId, cb) => {
    pgKratosQueries.getIdentityById([identityId], result => {
        if (result.err || result.res.length == 0) {
            return cb("Identity not found");
        }

        let identity = result.res[0];

        cb({
            traits: identity.traits
        });
    });
};

module.exports = getIdentityById;
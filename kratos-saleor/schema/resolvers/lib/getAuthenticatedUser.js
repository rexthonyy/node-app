const jwt = require('jsonwebtoken');
const pgKratosQueries = require('../../../postgres/kratos-queries');
const { getUserById } = require('./');

let getAuthenticatedUser = (context, cb) => {
    const authToken = context.headers["authorization-bearer"];
    if (!authToken) return cb(null);
    jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, (err, authUser) => {
        if (err || authUser == null) return cb(null);
        pgKratosQueries.getUserById([authUser.id], result => {
            if (result.err || result.res.length == 0) return cb(null);
            getUserById(user.id, user => {
                cb(user);
            });
        });
    });
}

module.exports = getAuthenticatedUser;
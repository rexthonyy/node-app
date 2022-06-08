const jwt = require('jsonwebtoken');
const pgKratosQueries = require('../postgres/kratos-queries');
const { getUserById } = require('../schema/resolvers/lib');

module.exports = async(resolve, root, args, context, info) => {
    context.user = await getAuthenticatedUser(context);
    context.msg = "works";
    return resolve(root, args, context, info);
};

let getAuthenticatedUser = (context) => {
    return new Promise((resolve) => {
        const authToken = context.headers["authorization-bearer"];
        if (!authToken) return resolve(null);
        jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, (err, authUser) => {
            if (err || authUser == null) return resolve(null);
            pgKratosQueries.getUserById([authUser.id], result => {
                if (result.err || result.res.length == 0) return cb(null);
                getUserById(user.id, user => {
                    resolve(user);
                });
            });
        });
    });
}
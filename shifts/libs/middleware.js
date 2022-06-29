const jwt = require('jsonwebtoken');
const getGraphQLUserById = require('../schema/resolvers/lib/getGraphQLUserById');

module.exports = async(resolve, root, args, context, info) => {
    context.user = await getAuthenticatedUser(context);
    return resolve(root, args, context, info);
};

let getAuthenticatedUser = (context) => {
    return new Promise((resolve) => {
        //const authToken = context.headers["authorization-bearer"];
        const authToken = process.env.TEST_TOKEN;
        if (!authToken) return resolve(null);
        jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, async(err, authUser) => {
            if (err || authUser == null) return resolve(null);
            try {
                let graphQLUser = await getGraphQLUserById(Number(authUser.sub));
                resolve(graphQLUser);
            } catch (err) {
                resolve(null);
            }
        });
    });
}
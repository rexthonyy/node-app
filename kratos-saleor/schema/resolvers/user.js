const pgKratosQueries = require("../../postgres/kratos-queries");
const { getGraphQLUserById } = require("./lib");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve) => {
        if (!context.user) return resolve(null);
        const authUser = context.user;

        let id = args.id;
        let email = args.email.toLowerCase();

        if (id) {
            resolve(await getUserById(id));
        } else if (email) {
            pgKratosQueries.getUserByEmail([email], async result => {
                if (result.err || result.res.length == 0) return resolve(null);
                resolve(await getUserById(result.res[0].id));
            });
        }

        resolve(null);
    });
}

function getUserById(id) {
    return new Promise(async(resolve) => {
        let graphQLUser = await getGraphQLUserById(id);
        resolve(graphQLUser);
    });
}
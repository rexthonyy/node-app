const pgKratosQueries = require("../../postgres/kratos-queries");
const { getGraphQLUserById } = require("./lib");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve) => {
        if (!context.user) return resolve(null);
        const authUser = context.user;

        let id = args.id ? args.id : null;
        let email = args.email ? args.email.toLowerCase() : null;

        if (id) {
            resolve(await getUserById(id));
        } else if (email) {
            pgKratosQueries.getUserByEmail([email], async result => {
                if (result.err || result.res.length == 0) return resolve(null);
                let accountUser = result.res[0];
                console.log(accountUser);
                resolve(await getUserById(accountUser.id));
            });
        }

        resolve(null);
    });
}

function getUserById(id) {
    return new Promise(async(resolve) => {
        console.log(id);
        let graphQLUser = await getGraphQLUserById(id);
        resolve(graphQLUser);
    });
}
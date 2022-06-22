const permissionsdbQueries = require('../../../postgres/permissionsdb-queries');
const getGraphQLUserById = require('./getGraphQLUserById');

let getUsersInGroupId = (groupId) => {
    return new Promise(resolve => {
        permissionsdbQueries.getAccountUserGroupsByGroupId([groupId], async result => {
            if (result.err || result.res.length == 0) {
                return resolve([]);
            }

            let accountUserGroupRows = result.res;
            let users = [];

            console.log(accountUserGroupRows);
            for (let accountUser of accountUserGroupRows) {
                let graphQLUser = await getUser(accountUser.user_id);
                users.push(graphQLUser);
            }

            resolve(users);
        });
    });
}

function getUser(userId) {
    return new Promise(async resolve => {
        console.log("user id: ", userId);
        let graphQLUser = await getGraphQLUserById(Number(accountUser.user_id));
        resolve(graphQLUser);
    });
}
module.exports = getUsersInGroupId;
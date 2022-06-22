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
                let graphQLUser = await getGraphQLUserById(accountUser.user_id);
                users.push(graphQLUser);
            }
            resolve(users);
        });
    });
}

module.exports = getUsersInGroupId;
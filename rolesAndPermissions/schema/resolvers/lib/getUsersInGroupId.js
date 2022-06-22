const permissionsdbQueries = require('../../../postgres/permissionsdb-queries');
const getGraphQLUserById = require('./getGraphQLUserById');

let getUsersInGroupId = (groupId, cb) => {
    permissionsdbQueries.getAccountUserGroupsByGroupId([groupId], async result => {
        if (result.err || result.res.length == 0) {
            return cb([]);
        }

        let accountUserGroupRows = result.res;
        let users = [];

        for (let accountUser of accountUserGroupRows) {
            console.log(accountUser.user_id);
            users.push(await getGraphQLUserById(accountUser.user_id));
        }
        cb(users);

    });
}

module.exports = getUsersInGroupId;
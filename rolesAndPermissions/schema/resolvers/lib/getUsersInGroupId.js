const permissionsdbQueries = require('../../../postgres/permissionsdb-queries');
const getGraphQLUserById = require('./getGraphQLUserById');

let getUsersInGroupId = (groupId, cb) => {
    permissionsdbQueries.getAccountUserGroupsByGroupId([groupId], result => {
        if (result.err || result.res.length == 0) {
            return cb([]);
        }

        let accountUserGroupRows = result.res;
        let rows = accountUserGroupRows.length;
        let count = -1;
        let users = [];

        accountUserGroupRows.forEach(async row => {
            let user_id = row.user_id;
            users.push(await getGraphQLUserById(user_id));
        });

        checkComplete();

        function checkComplete() {
            count++;
            if (count == rows) {
                cb(users);
            }
        }

    });
}

module.exports = getUsersInGroupId;
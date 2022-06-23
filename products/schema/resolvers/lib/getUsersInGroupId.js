const pgKratosQueries = require('../../../postgres/kratos-queries');
const pgPermissionsQueries = require('../../../postgres/permissionsdb-queries');

let getUsersInGroupId = (groupId) => {
    return new Promise(resolve => {
        pgPermissionsQueries.getAccountUserGroupsByGroupId([groupId], result => {
            if (result.err || result.res.length == 0) {
                return resolve([]);
            }

            let accountUserGroupRows = result.res;
            let rows = accountUserGroupRows.length;
            let count = -1;
            let users = [];

            accountUserGroupRows.forEach(row => {
                let user_id = row.user_id;
                pgKratosQueries.getUserById([user_id], result => {
                    if (!(result.err || result.res.length == 0)) {
                        users.push(result.res[0]);
                    }
                    checkComplete();
                });
            });

            checkComplete();

            function checkComplete() {
                count++;
                if (count == rows) {
                    resolve(users);
                }
            }

        });
    });
}

module.exports = getUsersInGroupId;
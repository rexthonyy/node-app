const permissionsdbQueries = require('../../../postgres/permissionsdb-queries');
const getIdentityById = require('./getIdentityById');

let getUsersInGroupId = (groupId, cb) => {
    permissionsdbQueries.getAccountUserGroupsByGroupId([groupId], result => {
        if (result.err || result.res.length == 0) {
            return cb([]);
        }

        let accountUserGroupRows = result.res;
        let rows = accountUserGroupRows.length;
        let count = -1;
        let users = [];

        accountUserGroupRows.forEach(row => {
            let user_id = row.user_id;

            getIdentityById(user_id, identity => {
                if (typeof identity != "string") {
                    let traits = identity.traits;
                    users.push(traits);
                }

                checkComplete();
            });
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
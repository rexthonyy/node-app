const pgPermissionsQueries = require('../../../postgres/permissionsdb-queries');
const getAuthGroupPermissionsByGroupId = require('./getAuthGroupPermissionsByGroupId');
const getUsersInGroupId = require('./getUsersInGroupId');

let getUserPermissionGroups = (userId) => {
    return new Promise(resolve => {
        pgPermissionsQueries.getAccountUserGroupsByUserId([userId], result => {
            if (result.err || result.res.length == 0) {
                return resolve([]);
            }

            let accountUserGroupRows = result.res;
            const numRows = accountUserGroupRows.length;
            let countGroups = -1;
            let userPermissionGroups = [];

            accountUserGroupRows.forEach(row => {
                pgPermissionsQueries.getAuthGroupById([row.group_id], async result => {
                    if (result.err || result.res.length == 0) {
                        checkPermissionGroupComplete();
                    } else {
                        let authGroup = result.res[0];

                        let permissions = await getAuthGroupPermissionsByGroupId(authGroup.id);
                        let userCanManage = false;

                        for (let i = 0, j = permissions.length; i < j; i++) {
                            if (permissions[i].code == "MANAGE_USERS") {
                                userCanManage = true;
                                break;
                            }
                        }
                        let users = await getUsersInGroupId(authGroup.id);

                        userPermissionGroups.push({
                            id: authGroup.id,
                            name: authGroup.name,
                            users,
                            permissions,
                            userCanManage
                        });
                    }
                });
            });

            checkPermissionGroupComplete();

            function checkPermissionGroupComplete() {
                countGroups++;
                if (countGroups == numRows) {
                    return resolve(userPermissionGroups);
                }
            }
        });
    });
};

module.exports = getUserPermissionGroups;
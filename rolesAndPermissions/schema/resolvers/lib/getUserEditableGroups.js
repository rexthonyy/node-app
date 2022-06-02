const permissionsdbQueries = require('../../../postgres/permissionsdb-queries');
const getAuthGroupPermissionsByGroupId = require('./getAuthGroupPermissionsByGroupId');
const getUsersInGroupId = require('./getUsersInGroupId');

let getUserEditableGroups = (authUser, userId, cb) => {
    permissionsdbQueries.getAccountUserGroupsByUserId([userId], result => {
        if (result.err || result.res.length == 0) {
            return cb([]);
        }

        let accountUserGroupRows = result.res;
        const numRows = accountUserGroupRows.length;
        let countGroups = -1;
        let userPermissionGroups = [];

        accountUserGroupRows.forEach(row => {
            permissionsdbQueries.getAuthGroupById([row.group_id], result => {
                if (result.err || result.res.length == 0) {
                    checkPermissionGroupComplete();
                } else {
                    let authGroup = result.res[0];
                    getAuthGroupPermissionsByGroupId(authGroup.id, permissions => {
                        let authUserPermissions = authUser ? (authUser.userPermissions ? authUser.userPermissions : []) : [];
                        let userCanManage = false;

                        for (let i = 0, j = authUserPermissions.length; i < j; i++) {
                            if (authUserPermissions[i].code == "MANAGE_USERS") {
                                userCanManage = true;
                                break;
                            }
                        }

                        if (!userCanManage) {
                            checkPermissionGroupComplete();
                        } else {
                            getUsersInGroupId(authGroup.id, users => {
                                userPermissionGroups.push({
                                    id: authGroup.id,
                                    name: authGroup.name,
                                    users,
                                    permissions,
                                    userCanManage
                                });

                                checkPermissionGroupComplete();
                            });
                        }
                    });
                }
            });
        });

        checkPermissionGroupComplete();

        function checkPermissionGroupComplete() {
            countGroups++;
            if (countGroups == numRows) {
                return cb(userPermissionGroups);
            }
        }
    });
};

module.exports = getUserEditableGroups;
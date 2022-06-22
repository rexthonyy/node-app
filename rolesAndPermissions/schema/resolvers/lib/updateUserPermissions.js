const permissionsdbQueries = require('../../../postgres/permissionsdb-queries');

let updateUserPermissions = (userId, permissionGroups, cb) => {
    return new Promise(resolve => {
        permissionsdbQueries.deleteAccountUserPermissionsByUserId([userId], result => {
            const numPermissionGroups = permissionGroups.length;
            let countPermissionGroups = -1;
            let userPermissionIds = [];

            function insertPermissionId(permission_id) {
                let found = false;
                for (const permissionId of userPermissionIds) {
                    if (permissionId == permission_id) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    userPermissionIds.push(permission_id);
                }
            }

            permissionGroups.forEach(permissionGroup => {
                let permissions = permissionGroup.permissions;
                for (const permission of permissions) {
                    insertPermissionId(permission.id);
                }
                checkPermissionGroupUpdateComplete();
            });

            checkPermissionGroupUpdateComplete();

            function checkPermissionGroupUpdateComplete() {
                countPermissionGroups++;
                if (countPermissionGroups == numPermissionGroups) {
                    const numUserPermissionIds = userPermissionIds.length;
                    let countUserPermissionIds = -1;

                    userPermissionIds.forEach(permissionId => {
                        permissionsdbQueries.createAccountUserPermission([userId, permissionId], result => {
                            checkPermissionIdUpdateComplete();
                        });
                    });

                    checkPermissionIdUpdateComplete();

                    function checkPermissionIdUpdateComplete() {
                        countUserPermissionIds++;
                        if (countUserPermissionIds == numUserPermissionIds) {
                            resolve();
                        }
                    }
                }
            }
        });
    });
};

module.exports = updateUserPermissions;
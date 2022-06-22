const pgPermissionsQueries = require('../../../postgres/permissionsdb-queries');

let getAuthGroupPermissionsByGroupId = (groupId) => {
    return new Promise(resolve => {
        pgPermissionsQueries.getAuthGroupPermissionsByGroupId([groupId], result => {
            if (result.err) {
                return resolve([]);
            }
            let groupPermissions = result.res;
            let numPermissions = groupPermissions.length;
            let countPermissions = -1;
            let permissions = [];

            groupPermissions.forEach(groupPermissionRow => {
                pgPermissionsQueries.getAuthPermissionById([groupPermissionRow.permission_id], result => {
                    if (result.res && result.res.length > 0) {
                        let authPermissionRow = result.res[0];
                        permissions.push({
                            id: authPermissionRow.id,
                            code: authPermissionRow.codename.toUpperCase(),
                            name: authPermissionRow.name
                        });
                    }
                    checkComplete();
                });
            });

            checkComplete();

            function checkComplete() {
                countPermissions++;
                if (countPermissions == numPermissions) {
                    resolve(permissions);
                }
            }
        });
    });
}

module.exports = getAuthGroupPermissionsByGroupId;
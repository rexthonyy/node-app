const permissionsdbQueries = require('../../../postgres/permissionsdb-queries');

let getUserPermissions = (userId, cb) => {
    permissionsdbQueries.getAccountUserPermissionsByUserId([userId], result => {
        if (result.err || result.res.length == 0) {
            return cb([]);
        }

        let accountUserUserPermissionsRow = result.res;
        const numRows = accountUserUserPermissionsRow.length;
        let countPermissions = -1;
        let userPermissions = [];

        accountUserUserPermissionsRow.forEach(row => {
            permissionsdbQueries.getAuthPermissionById([row.permission_id], result => {
                if (!(result.err || result.res.length == 0)) {
                    let authPermissionRow = result.res[0];
                    userPermissions.push({
                        code: (authPermissionRow.codename).toUpperCase(),
                        name: authPermissionRow.name
                    });
                }
                checkPermissionComplete();
            });
        });

        checkPermissionComplete();

        function checkPermissionComplete() {
            countPermissions++;
            if (countPermissions == numRows) {
                return cb(userPermissions);
            }
        }
    });
};

module.exports = getUserPermissions;
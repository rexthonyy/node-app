// Permission: PERMISSION_MANAGE_STAFF
// Look up permission group by ID. Requires one of the following permissions: MANAGE_STAFF.
const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getUsersInGroupId
} = require('./lib');
const permissionsdbQueries = require('../../postgres/permissionsdb-queries');
const getAuthGroupPermissionsByGroupId = require('./lib/getAuthGroupPermissionsByGroupId');

module.exports = async(parent, args, context) => {
    return new Promise((resolve, reject) => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return reject(message);

        let group_id = args.id;
        let accessPermissions = ["MANAGE_STAFF"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            permissionsdbQueries.getAuthGroupById([group_id], async result => {
                if (result.err) {
                    return resolve(getError(
                        "name",
                        result.err,
                        null, [],
                        users,
                        null
                    ));
                }

                if (result.res.length == 0) {
                    return reject(getError(
                        "id",
                        "Invalid group id",
                        400, [],
                        null,
                        null
                    ));
                }

                let authGroup = result.res[0];
                console.log(authGroup);

                const users = await getUsersInGroupId(authGroup.id);
                console.log(users);
                getAuthGroupPermissionsByGroupId(authGroup.id, permissions => {
                    let authUserPermissions = authUser.userPermissions;
                    let userCanManage = false;

                    for (let i = 0, j = authUserPermissions.length; i < j; i++) {
                        if (authUserPermissions[i].code == "MANAGE_USERS") {
                            userCanManage = true;
                            break;
                        }
                    }

                    resolve({
                        id: authGroup.id,
                        name: authGroup.name,
                        users,
                        permissions,
                        userCanManage
                    });
                });
            });
        } else {
            return reject(getError(
                null,
                "Permission not found. Requires PERMISSION_MANAGE_STAFF",
                "OUT_OF_SCOPE_PERMISSION", ["MANAGE_STAFF"],
                users,
                null
            ));
        }
    });
}


function getError(field, message, code, permissions, users, group) {
    return JSON.stringify({
        errors: [{
            field,
            message,
            code,
            permissions,
            users
        }],
        group
    });
}
// Delete permission group. Requires one of the following permissions: MANAGE_STAFF.

const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getUsersInGroupId
} = require('./lib');
const permissionsdbQueries = require('../../postgres/permissionsdb-queries');
const updateUserPermissions = require('./lib/updateUserPermissions');
const getUserPermissionGroups = require('./lib/getUserPermissionGroups');
const getAuthGroupPermissionsByGroupId = require('./lib/getAuthGroupPermissionsByGroupId');

module.exports = async(parent, args, context) => {
    return new Promise((resolve) => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getError(
            null,
            message,
            "INVALID", ["MANAGE_STAFF"],
            null,
            null
        ));
        let accessPermissions = ["MANAGE_STAFF"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            let groupId = args.id;
            permissionsdbQueries.getAuthGroupById([groupId], result => {
                if (result.err) {
                    return resolve(getError(
                        "name",
                        result.err,
                        "ERROR", [],
                        null,
                        null
                    ));
                }

                if (result.res.length == 0) {
                    return resolve(getError(
                        "name",
                        "Permission Group not found",
                        "REQUIRED", [],
                        null,
                        null
                    ));
                }

                let authGroup = result.res[0];

                deleteAccountUserGroupsByGroupId(authUser, groupId)
                    .then(() => {
                        deleteAuthGroupPermissions(groupId)
                            .then(() => {
                                deleteAuthGroup(groupId)
                                    .then(() => {
                                        getGroups(resolve, authUser, authGroup);
                                    });
                            });
                    });
            });
        } else {
            return resolve(getError(
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
    return {
        errors: [{
            field,
            message,
            code,
            permissions,
            users
        }],
        group
    };
}

function deleteAccountUserGroupsByGroupId(authUser, groupId) {
    return new Promise((resolve) => {
        permissionsdbQueries.getAccountUserGroupsByGroupId([groupId], result => {
            if (result.err) {
                return resolve();
            }

            let accountUserGroupRows = result.res;
            const numAccountUserGroups = accountUserGroupRows.length;
            let countAccountUserGroups = -1;

            accountUserGroupRows.forEach(row => {
                let userId = row.user_id;
                permissionsdbQueries.deleteAccountUserGroupsByUserId([userId], result => {
                    updateUser(authUser, userId, () => {
                        checkAccountUserGroupDeleteComplete();
                    });
                })
            });

            checkAccountUserGroupDeleteComplete();

            function checkAccountUserGroupDeleteComplete() {
                countAccountUserGroups++;
                if (countAccountUserGroups == numAccountUserGroups) {
                    resolve();
                }
            }
        });
    });
}

function deleteAuthGroupPermissions(groupId) {
    return new Promise((resolve) => {
        permissionsdbQueries.deleteAuthGroupPermissionsByGroupId([groupId], result => {
            resolve();
        });
    });
}

function deleteAuthGroup(groupId) {
    return new Promise((resolve) => {
        permissionsdbQueries.deleteAuthGroupById([groupId], result => {
            resolve();
        });
    });
}

function updateUser(authUser, user, cb) {
    getUserPermissionGroups(authUser, user, userPermissionGroups => {
        updateUserPermissions(user, userPermissionGroups, () => {
            cb();
        });
    });
}

function getGroups(resolve, authUser, group) {
    getAuthGroupPermissionsByGroupId(group.id, async permissions => {
        const users = await getUsersInGroupId(group.id);
        let authUserPermissions = authUser ? (authUser.userPermissions ? authUser.userPermissions : []) : [];
        let userCanManage = false;

        for (let i = 0, j = authUserPermissions.length; i < j; i++) {
            if (authUserPermissions[i].code == "MANAGE_USERS") {
                userCanManage = true;
                break;
            }
        }

        let res = {
            errors: [{
                field: null,
                message: "Group deleted successfully",
                code: "REQUIRED",
                permissions: null,
                users: null
            }],
            group: {
                id: group.id,
                name: group.name,
                users,
                permissions,
                userCanManage
            },
            permissionGroupErrors: [{
                field: null,
                message: "Group deleted successfully",
                code: "REQUIRED",
                permissions: null,
                users: null
            }]
        };

        resolve(res);
    });
}
// Delete permission group. Requires one of the following permissions: MANAGE_STAFF.

const { hasAllPermissions } = require('./lib');
const permissionsdbQueries = require('../../postgres/permissionsdb-queries');
const pgKratosQueries = require('../../postgres/kratos-queries');
const getUserPermissions = require('./lib/getUserPermissions');
const updateUserPermissions = require('./lib/updateUserPermissions');
const getUserPermissionGroups = require('./lib/getUserPermissionGroups');
const getUserEditableGroups = require('./lib/getUserEditableGroups');
const getAuthGroupPermissionsByGroupId = require('./lib/getAuthGroupPermissionsByGroupId');
const getAuthenticatedUser = require('./lib/getAuthenticatedUser');
const getUsersInGroupId = require('./lib/getUsersInGroupId');
const getIdentityById = require('./lib/getIdentityById');

module.exports = async(parent, args, context) => {
    return new Promise((resolve) => {
        getAuthenticatedUser(context, authUser => {
            let groupId = args.id;

            if (hasAllPermissions(context.body.variables, ["PERMISSION_MANAGE_STAFF"])) {
                permissionsdbQueries.getAuthGroupById([groupId], result => {
                    if (result.err) {
                        return resolve(getError(
                            "name",
                            result.err,
                            "ERROR", [],
                            users,
                            null
                        ));
                    }

                    if (result.res.length == 0) {
                        return resolve(getError(
                            "name",
                            "Permission Group not found",
                            "REQUIRED", [],
                            users,
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
            }
        });
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
            getUserPermissions(user, userPermissions => {
                getUserEditableGroups(authUser, user, userEditableGroups => {
                    getIdentityById(user, identity => {
                        if (typeof identity != "string") {
                            let traits = identity.traits;
                            traits.userPermissions = userPermissions;
                            traits.permissionGroups = userPermissionGroups;
                            traits.editableGroups = userEditableGroups;

                            pgKratosQueries.updateIdentityTraitsById([user, JSON.stringify(traits)], result => {
                                cb();
                            });
                        } else {
                            cb();
                        }
                    });
                });
            });
        });
    });
}

function getGroups(resolve, authUser, group) {
    getAuthGroupPermissionsByGroupId(group.id, permissions => {
        getUsersInGroupId(group.id, users => {
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
    });
}
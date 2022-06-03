// Update permission group. Requires one of the following permissions: MANAGE_STAFF.
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
            let permissions = args.input.addPermissions;
            let users = args.input.addUsers;
            let groupName = args.input.name;
            let removePermissions = args.input.removePermissions;
            let removeUsers = args.input.removeUsers;

            if (hasAllPermissions(context.body.variables, ["PERMISSION_MANAGE_STAFF"])) {
                for (let i = 0, j = permissions.length; i < j; i++) {
                    permissions[i] = permissions[i].toLowerCase();
                }
                for (let i = 0, j = removePermissions.length; i < j; i++) {
                    removePermissions[i] = removePermissions[i].toLowerCase();
                }

                permissionsdbQueries.updateAuthGroupById([groupId, groupName], result => {
                    if (result.err) {
                        return resolve(getError(
                            "name",
                            result.err,
                            null, [],
                            users,
                            null
                        ));
                    }

                    getAuthGroupPermissionsByGroupId(groupId, authGroupPermissions => {
                        let newGroupPermissions = [];
                        for (let k = 0, l = permissions.length; k < l; k++) {
                            let isFound = false;
                            for (let i = 0, j = authGroupPermissions.length; i < j; i++) {
                                if (permissions[k] == authGroupPermissions[i].code.toLowerCase()) {
                                    isFound = true;
                                    break;
                                }
                            }
                            if (!isFound) {
                                newGroupPermissions.push(permissions[k]);
                            }
                        }

                        const numNewGroupPermissions = newGroupPermissions.length;
                        let countNewGroupPermissions = -1;

                        newGroupPermissions.forEach(newGroupPermissionCodename => {
                            permissionsdbQueries.getAuthPermissionsByCodename("codename=$1", [newGroupPermissionCodename], result => {
                                if (result.res && result.res.length > 0) {
                                    let authPermission = result.res[0];
                                    permissionsdbQueries.createAuthGroupPermission([groupId, authPermission.id], result => {
                                        checkNewGroupPermissionComplete();
                                    });
                                } else {
                                    checkNewGroupPermissionComplete();
                                }
                            });
                        });

                        checkNewGroupPermissionComplete();

                        function checkNewGroupPermissionComplete() {
                            countNewGroupPermissions++;
                            if (countNewGroupPermissions == numNewGroupPermissions) {

                                permissionsdbQueries.getAccountUserGroupsByGroupId([groupId], result => {
                                    if (result.err || result.res.length == 0) {
                                        return cb([]);
                                    }

                                    let newGroupUsers = [];
                                    let accountUserGroupRows = result.res;

                                    for (let k = 0, l = users.length; k < l; k++) {
                                        let isFound = false;
                                        for (let i = 0, j = accountUserGroupRows.length; i < j; i++) {
                                            if (users[k] == accountUserGroupRows[i].user_id) {
                                                isFound = true;
                                                break;
                                            }
                                        }
                                        if (!isFound) {
                                            newGroupUsers.push(users[k]);
                                        }
                                    }

                                    const numNewGroupUsers = newGroupUsers.length;
                                    let countNewGroupUsers = -1;

                                    newGroupUsers.forEach(newGroupUser => {
                                        permissionsdbQueries.createAccountUserGroup([newGroupUser, groupId], result => {
                                            checkNewGroupUsersComplete();
                                        });
                                    });

                                    checkNewGroupUsersComplete();

                                    function checkNewGroupUsersComplete() {
                                        countNewGroupUsers++;
                                        if (countNewGroupUsers == numNewGroupUsers) {
                                            let idsOfPermissionsToRemove = [];
                                            for (let k = 0, l = removePermissions.length; k < l; k++) {
                                                for (let i = 0, j = authGroupPermissions.length; i < j; i++) {
                                                    if (removePermissions[k] == authGroupPermissions[i].code.toLowerCase()) {
                                                        idsOfPermissionsToRemove.push(authGroupPermissions[i].id);
                                                        break;
                                                    }
                                                }
                                            }

                                            const numIdsOfPermissionsToRemove = idsOfPermissionsToRemove.length;
                                            let countIdsOfPermissionsToRemove = -1;

                                            idsOfPermissionsToRemove.forEach(groupPermissionId => {
                                                permissionsdbQueries.deleteAuthGroupPermissionsByPermissionsId([groupId, groupPermissionId], result => {
                                                    checkIdsOfPermissionsToRemoveComplete();
                                                });
                                            });

                                            checkIdsOfPermissionsToRemoveComplete();

                                            function checkIdsOfPermissionsToRemoveComplete() {
                                                countIdsOfPermissionsToRemove++;
                                                if (countIdsOfPermissionsToRemove == numIdsOfPermissionsToRemove) {
                                                    const numUsers = removeUsers.length;
                                                    let countUsersToRemove = -1;

                                                    removeUsers.forEach(userId => {
                                                        permissionsdbQueries.deleteAccountUserGroupsByUserId([userId, groupId], result => {
                                                            checkUsersToRemoveComplete();
                                                        });
                                                    });

                                                    checkUsersToRemoveComplete();

                                                    function checkUsersToRemoveComplete() {
                                                        countUsersToRemove++;
                                                        if (countUsersToRemove == numUsers) {
                                                            permissionsdbQueries.getAccountUserGroupsByGroupId([groupId], result => {
                                                                let usersInGroup = [];
                                                                if (!(result.err || result.res.length == 0)) {
                                                                    let accountUserRow = result.res;
                                                                    for (let i = 0, j = accountUserRow.length; i < j; i++) {
                                                                        usersInGroup.push(accountUserRow[i].user_id);
                                                                    }
                                                                }

                                                                updateUserPermission(authUser, usersInGroup, () => {
                                                                    getGroups(resolve, authUser, groupId, groupName);
                                                                });
                                                            });
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                        }
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

function updateUserPermission(authUser, users, cb) {
    const numUsers = users.length;
    let countUsers = -1;

    users.forEach(user => {
        getUserPermissionGroups(authUser, user, userPermissionGroups => {
            updateUserPermissions(user, userPermissionGroups, () => {
                getUserPermissions(user, userPermissions => {
                    getUserEditableGroups(authUser, user, userEditableGroups => {
                        getIdentityById(user, identity => {
                            if (typeof identity != "string") {
                                let traits = identity.traits;
                                console.log(traits);
                                traits.userPermissions = userPermissions;
                                traits.permissionGroups = userPermissionGroups;
                                traits.editableGroups = userEditableGroups;

                                pgKratosQueries.updateIdentityTraitsById([user, JSON.stringify(traits)], result => {
                                    checkUserComplete();
                                });
                            } else {
                                checkUserComplete();
                            }
                        });
                    });
                });
            });
        });
    });

    checkUserComplete();

    function checkUserComplete() {
        countUsers++;
        if (countUsers == numUsers) {
            cb();
        }
    }
}


function getGroups(resolve, authUser, groupId, groupName) {
    getAuthGroupPermissionsByGroupId(groupId, permissions => {
        getUsersInGroupId(groupId, users => {
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
                    message: "Group updated successfully",
                    code: "REQUIRED",
                    permissions: null,
                    users: null
                }],
                group: {
                    id: groupId,
                    name: groupName,
                    users,
                    permissions,
                    userCanManage
                },
                permissionGroupErrors: [{
                    field: null,
                    message: "Group updated successfully",
                    code: "REQUIRED",
                    permissions: null,
                    users: null
                }]
            };

            resolve(res);
        });
    });
}
// Update permission group. Requires one of the following permissions: MANAGE_STAFF.
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
            "REQUIRED", ["MANAGE_STAFF"],
            null,
            null
        ));
        let accessPermissions = ["MANAGE_STAFF"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            let groupId = args.id;
            let permissions = args.input.addPermissions;
            let users = args.input.addUsers;
            let groupName = args.input.name;
            let removePermissions = args.input.removePermissions;
            let removeUsers = args.input.removeUsers;

            permissionsdbQueries.getAuthGroupById([groupId], async result => {
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

                await updateGroupName(groupId, groupName);
                await addGroupPermissions(groupId, permissions);
                await addNewUsersToGroupPermissions(groupId, users);
                await removeGroupPermissions(groupId, removePermissions);
                await removeGroupUsers(authUser, groupId, removeUsers);
                permissionsdbQueries.getAccountUserGroupsByGroupId([groupId], result => {
                    let usersInGroup = [];
                    if (!(result.err || result.res.length == 0)) {
                        let accountUserRow = result.res;
                        for (let i = 0, j = accountUserRow.length; i < j; i++) {
                            usersInGroup.push(accountUserRow[i].user_id);
                        }
                    }

                    if (groupName) authGroup.name = groupName;
                    updateUserPermission(authUser, usersInGroup, async() => {
                        resolve(getGroups(authUser, authGroup));
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

function updateGroupName(groupId, groupName) {
    return new Promise((resolve) => {
        if (!groupName) return resolve();
        permissionsdbQueries.updateAuthGroupById([groupId, groupName], result => {
            if (result.err) {
                return resolve(getError(
                    "name",
                    result.err,
                    "REQUIRED", [],
                    users,
                    null
                ));
            }

            resolve();
        });
    });
}

function addGroupPermissions(groupId, permissions) {
    return new Promise(async(resolve) => {
        if (permissions == null) return resolve();

        const authGroupPermissions = await getAuthGroupPermissionsByGroupId(groupId);
        for (let i = 0, j = permissions.length; i < j; i++) {
            permissions[i] = permissions[i].toLowerCase();
        }

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
                resolve();
            }
        }
    });
}

function addNewUsersToGroupPermissions(groupId, users) {
    return new Promise((resolve) => {
        if (users == null) return resolve();
        permissionsdbQueries.getAccountUserGroupsByGroupId([groupId], result => {
            if (result.err) {
                return resolve();
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
                    resolve();
                }
            }
        });
    });
}

function removeGroupPermissions(groupId, removePermissions) {
    return new Promise(async(resolve) => {
        if (removePermissions == null) return resolve();
        const authGroupPermissions = await getAuthGroupPermissionsByGroupId(groupId);
        for (let i = 0, j = removePermissions.length; i < j; i++) {
            removePermissions[i] = removePermissions[i].toLowerCase();
        }

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
                resolve();
            }
        }
    });
}

function removeGroupUsers(authUser, groupId, removeUsers) {
    return new Promise((resolve) => {
        if (removeUsers == null) return resolve();
        const numUsers = removeUsers.length;
        let countUsersToRemove = -1;

        removeUsers.forEach(userId => {
            permissionsdbQueries.deleteAccountUserGroupsByUserId([userId, groupId], result => {
                updateUser(authUser, userId, () => {
                    checkUsersToRemoveComplete();
                });
            });
        });

        checkUsersToRemoveComplete();

        function checkUsersToRemoveComplete() {
            countUsersToRemove++;
            if (countUsersToRemove == numUsers) {
                resolve();
            }
        }
    });
}


async function updateUser(authUser, user, cb) {
    const userPermissionGroups = await getUserPermissionGroups(authUser, user);
    await updateUserPermissions(user, userPermissionGroups);
    cb();
}

function updateUserPermission(authUser, users, cb) {
    const numUsers = users.length;
    let countUsers = -1;

    users.forEach(user => {
        updateUser(authUser, user, () => {
            checkUserComplete();
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

function getGroups(authUser, group) {
    return new Promise(async resolve => {
        const permissions = await getAuthGroupPermissionsByGroupId(group.id);
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
                message: "Group updated successfully",
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
                message: "Group updated successfully",
                code: "REQUIRED",
                permissions: null,
                users: null
            }]
        };

        resolve(res);
    });
}
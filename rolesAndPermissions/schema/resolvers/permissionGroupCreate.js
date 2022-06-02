// Create new permission group. Requires one of the following permissions: MANAGE_STAFF.
const { hasAllPermissions } = require('./lib');
const permissionsdbQueries = require('../../postgres/permissionsdb-queries');
const pgKratosQueries = require('../../postgres/kratos-queries');
const getUserPermissions = require('./lib/getUserPermissions');
const getUserPermissionGroups = require('./lib/getUserPermissionGroups');
const getUserEditableGroups = require('./lib/getUserEditableGroups');
const getAuthGroupPermissionsByGroupId = require('./lib/getAuthGroupPermissionsByGroupId');
const getAuthenticatedUser = require('./lib/getAuthenticatedUser');
const getUsersInGroupId = require('./lib/getUsersInGroupId');
const getIdentityById = require('./lib/getIdentityById');

module.exports = async(parent, args, context) => {
    return new Promise((resolve) => {
        getAuthenticatedUser(context, authUser => {
            console.log(authUser);
            let permissions = args.input.addPermissions;
            let users = args.input.addUsers;
            let groupName = args.input.name;

            if (hasAllPermissions(context.variables, ["PERMISSION_MANAGE_STAFF"])) {

                for (let i = 0, j = permissions.length; i < j; i++) {
                    permissions[i] = permissions[i].toLowerCase();
                }

                permissionsdbQueries.createAuthGroup([groupName], result => {
                    if (result.err) {
                        return resolve(getError(
                            "name",
                            result.err,
                            null, [],
                            users,
                            null
                        ));
                    }

                    let authGroup = result.res;

                    let numUsers = users.length;
                    let countUsers = -1;

                    users.forEach(user => {
                        let values = [
                            user,
                            authGroup.id
                        ];
                        permissionsdbQueries.createAccountUserGroup(values, result => {
                            checkUsersComplete();
                        });
                    });

                    checkUsersComplete();

                    function checkUsersComplete() {
                        countUsers++;
                        if (countUsers == numUsers) {
                            permissionsdbQueries.getAuthPermissionsByCodename(generateWhereClause(permissions), permissions, result => {
                                if (result.err) {
                                    return resolve(getError(
                                        null,
                                        result.err,
                                        null, [],
                                        users,
                                        null
                                    ));
                                }

                                let authPermissions = result.res;

                                if (authPermissions.length != permissions.length) {
                                    return resolve(getError(
                                        "addPermissions",
                                        "Invalid permission",
                                        "OUT_OF_SCOPE_PERMISSION",
                                        permissions,
                                        null,
                                        null
                                    ));
                                }

                                let numPermissions = authPermissions.length;
                                let count = -1;

                                authPermissions.forEach(permission => {
                                    let values = [
                                        authGroup.id,
                                        permission.id
                                    ];

                                    permissionsdbQueries.createAuthGroupPermission(values, result => {
                                        checkComplete();
                                    });
                                });

                                checkComplete();

                                function checkComplete() {
                                    count++;
                                    if (count == numPermissions) {
                                        updateUserPermissions(authUser, users, () => {
                                            getGroups(resolve, authUser, authGroup);
                                        });
                                    }
                                }
                            });
                        }
                    }
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

function generateWhereClause(permissions) {
    let whereClause = "";
    for (let i = 0, j = permissions.length; i < j; i++) {
        if (i != 0) {
            whereClause += " OR ";
        }
        whereClause += `codename=$${i+1}`;
    }
    return whereClause;
}

function updateUserPermissions(authUser, users, cb) {
    const numUsers = users.length;
    let countUsers = -1;

    users.forEach(user => {
        getUserPermissions(user, userPermissions => {
            getUserPermissionGroups(authUser, user, userPermissionGroups => {
                getUserEditableGroups(authUser, user, userEditableGroups => {
                    getIdentityById(user, identity => {
                        if (typeof identity != "string") {
                            let traits = identity.traits;
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

    checkUserComplete();

    function checkUserComplete() {
        countUsers++;
        if (countUsers == numUsers) {
            cb();
        }
    }
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
                    message: "Group created successfully",
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
                    message: "Group created successfully",
                    code: "REQUIRED",
                    permissions: null,
                    users: null
                }]
            };

            resolve(res);
        });
    });
}
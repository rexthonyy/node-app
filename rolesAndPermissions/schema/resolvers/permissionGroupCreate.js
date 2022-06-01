// Create new permission group. Requires one of the following permissions: MANAGE_STAFF.
const { hasPermission } = require('./lib');
const permissionsdbQueries = require('../../postgres/permissionsdb-queries');
const getIdentityById = require('./lib/getIdentityById');

module.exports = async(parent, args, context) => {
    return new Promise((resolve) => {
        let permissions = args.input.addPermissions;
        let users = args.input.addUsers;
        let groupName = args.input.name;

        if (hasPermission(context.variables, ["PERMISSION_MANAGE_STAFF"])) {

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
                                    getGroups(resolve, authGroup);
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

function getGroups(resolve, group) {
    getPermissions(group.id, permissions => {
        getUsers(group.id, users => {
            let userCanManage = false;
            if (permissions.find(permission => permission.code == "MANAGE_USERS")) {
                userCanManage = true;
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

            console.log(res);
            resolve(res);
        });
    });
}

function getPermissions(groupId, cb) {
    permissionsdbQueries.getAuthGroupPermissionsByGroupId([groupId], result => {
        if (result.err) {
            return cb([]);
        }
        let groupPermissions = result.res;
        let numPermissions = groupPermissions.length;
        let countPermissions = -1;
        let permissions = [];

        groupPermissions.forEach(groupPermissionRow => {
            permissionsdbQueries.getAuthPermissionById([groupPermissionRow.permission_id], result => {
                if (result.res && result.res.length > 0) {
                    let authPermissionRow = result.res[0];
                    permissions.push({
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
                cb(permissions);
            }
        }
    });
}

function getUsers(groupId, cb) {
    permissionsdbQueries.getAccountUserGroupsByGroupId([groupId], result => {
        if (result.err || result.res.length == 0) {
            return cb([]);
        }

        let accountUserGroupRows = result.res;
        let rows = accountUserGroupRows.length;
        let count = -1;
        let users = [];

        accountUserGroupRows.forEach(row => {
            let user_id = row.user_id;
            getIdentityById(user_id, identity => {
                if (typeof identity != "string") {
                    let traits = identity.traits;
                    users.push(traits);
                }

                checkComplete();
            });
        });

        checkComplete();

        function checkComplete() {
            count++;
            if (count == rows) {
                cb(users);
            }
        }

    });
}
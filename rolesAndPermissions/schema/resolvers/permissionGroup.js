// Permission: PERMISSION_MANAGE_STAFF
// Look up permission group by ID. Requires one of the following permissions: MANAGE_STAFF.
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
            let id = args.id;

            if (hasAllPermissions(context.body.variables, ["PERMISSION_MANAGE_STAFF"])) {

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
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
    return new Promise((resolve, reject) => {
        getAuthenticatedUser(context, authUser => {
            let group_id = args.id;

            if (hasAllPermissions(context.body.variables, ["PERMISSION_MANAGE_STAFF"])) {
                permissionsdbQueries.getAuthGroupById([group_id], result => {
                    if (result.err) {
                        return resolve(getError(
                            "name",
                            result.err,
                            null, [],
                            users,
                            null
                        ));
                    }

                    let authGroup = result.res[0];

                    getUsersInGroupId(authGroup.id, users => {
                        getAuthGroupPermissionsByGroupId(authGroup.id, permissions => {
                            let authUserPermissions = authUser ? (authUser.userPermissions ? authUser.userPermissions : []) : [];
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
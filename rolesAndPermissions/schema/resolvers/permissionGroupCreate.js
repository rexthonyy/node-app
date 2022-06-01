// Create new permission group. Requires one of the following permissions: MANAGE_STAFF.
const { hasPermission } = require('./lib');
const permissionsdbQueries = require('../../postgres/permissionsdb-queries');

module.exports = async(parent, args, context) => {
    let permissions = args.input.addPermissions;
    let users = args.input.addUsers;
    let groupName = args.input.name;

    if (hasPermission(context.variables, ["PERMISSION_MANAGE_STAFF"])) {

        for (let i = 0, j = permissions.length; i < j; i++) {
            permissions[i] = permissions[i].toLowerCase();
        }

        permissionsdbQueries.createAuthGroup([groupName], result => {
            if (result.err) {
                return getError(
                    "name",
                    result.err,
                    null, [],
                    users,
                    null
                );
            }

            let authGroup = result.res;

            permissionsdbQueries.getAuthPermissionsByCodename(generateWhereClause(permissions), permissions, result => {
                if (result.err) {
                    return getError(
                        null,
                        result.err,
                        null, [],
                        users,
                        null
                    );
                }

                let authPermissions = result.res;

                if (authPermissions.length != permissions.length) {
                    return getError(
                        "addPermissions",
                        "Invalid permission",
                        "OUT_OF_SCOPE_PERMISSION",
                        permissions,
                        null,
                        null
                    );
                } else {
                    console.log("valid");
                }
            });
        });
        return {
            id: args.id,
            name: "sample group",
            users: null,
            permissions: [{
                code: "MANAGE_USERS",
                name: "manage users"
            }],
            userCanManage: true
        };
    } else {
        return getError(
            null,
            "Permission not found. Requires PERMISSION_MANAGE_STAFF",
            "OUT_OF_SCOPE_PERMISSION", ["MANAGE_STAFF"],
            users,
            null
        );
    }
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
            whereClause += " AND ";
        }
        whereClause += `codename=$${i+1}`;
    }
    return whereClause;
}
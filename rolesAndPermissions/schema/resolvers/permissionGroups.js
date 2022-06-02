// List of permission groups. Requires one of the following permissions: MANAGE_STAFF.
const { hasAllPermissions } = require('./lib');
const permissionsdbQueries = require('../../postgres/permissionsdb-queries');
const getAuthGroupPermissionsByGroupId = require('./lib/getAuthGroupPermissionsByGroupId');
const getAuthenticatedUser = require('./lib/getAuthenticatedUser');
const getUsersInGroupId = require('./lib/getUsersInGroupId');

module.exports = async(parent, args, context) => {
    return new Promise((resolve, reject) => {
        getAuthenticatedUser(context, authUser => {
            if (hasAllPermissions(context.body.variables, ["PERMISSION_MANAGE_STAFF"])) {

                permissionsdbQueries.getAuthGroups(result => {
                    if (result.err) {
                        return resolve(getError(
                            "name",
                            result.err,
                            null, [],
                            users,
                            null
                        ));
                    }

                    let authGroups = result.res;
                    const numAuthGroups = authGroups.length;
                    let countAuthGroups = -1;
                    let edges = [];

                    authGroups.forEach(authGroup => {
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

                                edges.push({
                                    id: authGroup.id,
                                    name: authGroup.name,
                                    users,
                                    permissions,
                                    userCanManage
                                });
                            });
                        });
                    });

                    checkAuthGroupComplete();

                    function checkAuthGroupComplete() {
                        countAuthGroups++;
                        if (countAuthGroups == numAuthGroups) {
                            filterAndSortPermissions(resolve, args, edges);
                        }
                    }
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

function filterAndSortPermissions(resolve, args, data) {
    let filterSearch = args.filter.search;
    let filterIds = args.filter.ids;
    let sortByDirection = args.sortBy.direction;
    let sortByField = args.sortBy.field;
    let before = args.before;
    let after = args.after;
    let first = args.first;
    let last = args.last;

    resolve(data);
}
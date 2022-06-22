// List of permission groups. Requires one of the following permissions: MANAGE_STAFF.
const { hasAllPermissions } = require('./lib');
const permissionsdbQueries = require('../../postgres/permissionsdb-queries');
const getAuthGroupPermissionsByGroupId = require('./lib/getAuthGroupPermissionsByGroupId');
const getUsersInGroupId = require('./lib/getUsersInGroupId');

module.exports = async(parent, args, context) => {
    return new Promise((resolve, reject) => {
        let authUser = context.user;
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
                                cursor: "",
                                node: {
                                    id: authGroup.id,
                                    name: authGroup.name,
                                    users,
                                    permissions,
                                    userCanManage
                                }
                            });

                            checkAuthGroupComplete();
                        });
                    });
                });

                checkAuthGroupComplete();

                function checkAuthGroupComplete() {
                    countAuthGroups++;
                    if (countAuthGroups == numAuthGroups) {
                        filterAndSortPermissions(resolve, reject, args, edges);
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

function filterAndSortPermissions(resolve, reject, args, edges) {
    let filterSearch = args.filter.search || null;
    let filterIds = args.filter.ids || null;
    let sortByDirection = args.sortBy.direction || null;
    let sortByField = args.sortBy.field || null;
    let before = args.before || null;
    let after = args.after || null;
    let first = args.first || null;
    let last = args.last || null;

    if (!(first || last)) {
        return reject(getError(
            "first|last",
            "You must provide a `first` or `last` value to properly paginate the `permissionGroups` connection.",
            "REQUIRED",
            null,
            null,
            null
        ));
    }

    if (!(first || last)) {
        return reject(getError(
            "first|last",
            "You must provide a `first` or `last` value to properly paginate the `permissionGroups` connection.",
            "REQUIRED",
            null,
            null,
            null
        ));
    }

    resolve({
        pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: "",
            endCursor: ""
        },
        edges,
        totalCount: edges.length
    });
}
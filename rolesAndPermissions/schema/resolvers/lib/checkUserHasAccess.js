let userHasAccess = (userPermissions, permissions) => {
    let hasAccess = false;
    if (userPermissions.find(uPermission => {
            for (let requiredPermission of permissions) {
                if (requiredPermission == uPermission) {
                    return true;
                }
            }
        })) {
        hasAccess = true;
    }

    return hasAccess;
};

let userPermissionGroupHasAccess = (permissionGroups, permissions) => {
    let hasAccess = false;
    for (let group of permissionGroups) {
        if (group.permissions.find(permission => {
                for (let requiredPermission of permissions) {
                    if (requiredPermission == permission.code) {
                        return true;
                    }
                }
            })) {
            hasAccess = true;
        }
    }

    return hasAccess;
};

module.exports = {
    userHasAccess,
    userPermissionGroupHasAccess
};
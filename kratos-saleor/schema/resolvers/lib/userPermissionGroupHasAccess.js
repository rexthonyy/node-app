let userPermissionGroupHasAccess = (permissionGroups, permissions) => {
    let hasAccess = false;
    for (let group of permissionGroups) {
        if (group.permissions.find(permission => {
                for (let requiredPermission of permissions) {
                    console.log(requiredPermission);
                    console.log(permission.code);
                    if (requiredPermission == permission.code) {
                        console.log("...");
                        return true;
                    }
                }
            })) {
            hasAccess = true;
        }
    }

    console.log(hasAccess);
    return hasAccess;
};

module.exports = userPermissionGroupHasAccess;
let userPermissionGroupHasAccess = (permissionGroups, permissions) => {
    let hasAccess = false;
    console.log(permissionGroups.permissions);
    for (let group of permissionGroups) {
        if (group.permissions.find(permission => {
                for (let requiredPermission of permissions) {
                    if (requiredPermission == permission) {
                        return true;
                    }
                }
            })) {
            hasAccess = true;
        }
    }
    return hasAccess;
};

module.exports = userPermissionGroupHasAccess;
let userPermissionGroupHasAccess = (permissionGroups, permissions) => {
    let hasAccess = false;
    for (let group of permissionGroups) {
        console.log(group.permissions);
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
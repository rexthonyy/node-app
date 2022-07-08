const shiftQueries = require("../../../postgres/shift-queries");
const { checkAuthorization, userPermissionGroupHasAccess } = require('../lib');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message, null));

        let channelId = args.channelId;
        let shiftGroupId = args.shiftGroupId;
        let name = args.name;

        if (authUser.userPermissions.find(permission => permission.code == "MANAGE_STAFF")) {
            resolve(await shiftGroupRename(channelId, shiftGroupId, name));
        } else if (userPermissionGroupHasAccess(authUser.permissionGroups, ["MANAGE_STAFF"])) {
            resolve(await shiftGroupRename(channelId, shiftGroupId, name));
        } else {
            resolve(getGraphQLOutput("failed", "You do not have permission to perform this operation", null));
        }
    });
}

function getGraphQLOutput(status, message, result) {
    return {
        status,
        message,
        result
    };
}

function shiftGroupRename(channelId, shiftGroupId, name) {
    return new Promise(resolve => {
        shiftQueries.updateShiftGroupById([shiftGroupId, name], "name=$2", result => {
            if (result.err) return resolve(getGraphQLOutput("failed", JSON.stringify(result.err), null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("failed", "Failed to rename shift group", null));
            let shiftGroup = result.res[0];
            let data = {
                channelId: shiftGroup.channel_id,
                shiftGroupId: shiftGroup.id,
                name: shiftGroup.name
            };
            resolve(getGraphQLOutput("success", "Shift group renamed", data));
        });
    });
}
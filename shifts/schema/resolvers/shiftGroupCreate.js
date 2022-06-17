const shiftQueries = require("../../postgres/shift-queries");
const { checkAuthorization, userPermissionGroupHasAccess } = require('./lib');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message, null));

        let channelId = args.channelId;
        let name = args.name || "Unnamed group";

        if (authUser.userPermissions.find(permission => permission.code == "MANAGE_STAFF")) {
            resolve(await shiftGroupCreate(channelId, name));
        } else if (userPermissionGroupHasAccess(authUser.permissionGroups, ["MANAGE_STAFF"])) {
            resolve(await shiftGroupCreate(channelId, name));
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

function shiftGroupCreate(channelId, name) {
    return new Promise(resolve => {
        shiftQueries.createShiftGroup([channelId, name, -1], result => {
            if (result.err) { console.log(result.err); return resolve(getGraphQLOutput("failed", "Failed to create shift groups", null)) };
            let shiftGroup = result.res[0];
            let data = {
                channelId: shiftGroup.channel_id,
                shiftGroupId: shiftGroup.id,
                name: shiftGroup.name
            };
            resolve(getGraphQLOutput("success", "Shift group created", data));
        });
    });
}
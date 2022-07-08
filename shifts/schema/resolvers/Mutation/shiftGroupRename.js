const shiftQueries = require("../../../postgres/shift-queries");
const { checkAuthorization, userPermissionGroupHasAccess } = require('../lib');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message, "INVALID", null));

        let channelId = args.channelId;
        let shiftGroupId = args.shiftGroupId;
        let name = args.name;

        if (authUser.userPermissions.find(permission => permission.code == "MANAGE_STAFF")) {
            resolve(await shiftGroupRename(channelId, shiftGroupId, name));
        } else if (userPermissionGroupHasAccess(authUser.permissionGroups, ["MANAGE_STAFF"])) {
            resolve(await shiftGroupRename(channelId, shiftGroupId, name));
        } else {
            resolve(getGraphQLOutput("permission", "You do not have permission to perform this operation", "INVALID", null));
        }
    });
}

function getGraphQLOutput(field, message, code, shiftGroup = null) {
    return {
        errors: [{
            field,
            message,
            code
        }],
        shiftGroup
    }
}

function shiftGroupRename(channelId, shiftGroupId, name) {
    return new Promise(resolve => {
        shiftQueries.updateShiftGroupById([shiftGroupId, name], "name=$2", result => {
            if (result.err) return resolve(getGraphQLOutput("shiftGroupId, name", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("shiftGroupId, name", "Shift group not found", "NOT_FOUND", null));
            let shiftGroup = result.res[0];
            let data = {
                channelId: shiftGroup.channel_id,
                shiftGroupId: shiftGroup.id,
                name: shiftGroup.name
            };
            resolve({
                errors: [],
                shiftGroup: data
            });
        });
    });
}
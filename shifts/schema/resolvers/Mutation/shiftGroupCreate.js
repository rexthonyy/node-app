const kratosQueries = require("../../../postgres/kratos-queries");
const shiftQueries = require("../../../postgres/shift-queries");
const { checkAuthorization, userPermissionGroupHasAccess } = require('../lib');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message, "INVALID", null));

        let channelId = args.channelId;
        let name = args.name || "Unnamed group";

        if (authUser.userPermissions.find(permission => permission.code == "MANAGE_STAFF")) {
            resolve(await shiftGroupCreate(channelId, name));
        } else if (userPermissionGroupHasAccess(authUser.permissionGroups, ["MANAGE_STAFF"])) {
            resolve(await shiftGroupCreate(channelId, name));
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

function shiftGroupCreate(channelId, name) {
    return new Promise(resolve => {
        kratosQueries.getChannel([channelId], "id=$1", result => {
            if (result.err) return resolve(getGraphQLOutput("channelId", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("channelId", "Channel not found", "NOT_FOUND", null));
            shiftQueries.createShiftGroup([channelId, name, -1], result => {
                if (result.err || result.res.length == 0) return resolve(getGraphQLOutput("channelId, name", "Failed to create shift groups", "GRAPHQL_ERROR", null));
                let shiftGroup = result.res[0];
                let data = {
                    channelId: shiftGroup.channel_id,
                    shiftGroupId: shiftGroup.id,
                    name: shiftGroup.name
                };
                resolve({
                    errors: [],
                    shiftGroup: data
                })
            });
        });
    });
}
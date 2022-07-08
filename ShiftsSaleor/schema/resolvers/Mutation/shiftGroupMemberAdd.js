const kratosQueries = require("../../../postgres/kratos-queries");
const shiftQueries = require("../../../postgres/shift-queries");
const { checkAuthorization, userPermissionGroupHasAccess, getGraphQLUserById } = require('../lib');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message));

        let channelId = args.channelId;
        let shiftGroupId = args.shiftGroupId;
        let userId = args.userId;

        if (authUser.userPermissions.find(permission => permission.code == "MANAGE_STAFF")) {
            resolve(await shiftGroupMemberAdd(channelId, shiftGroupId, userId));
        } else if (userPermissionGroupHasAccess(authUser.permissionGroups, ["MANAGE_STAFF"])) {
            resolve(await shiftGroupMemberAdd(channelId, shiftGroupId, userId));
        } else {
            resolve(getGraphQLOutput("failed", "You do not have permission to perform this operation"));
        }
    });
}

function getGraphQLOutput(status, message) {
    return {
        status,
        message
    };
}

function shiftGroupMemberAdd(channelId, shiftGroupId, userId) {
    return new Promise(async resolve => {
        try {
            let userToAdd = await getGraphQLUserById(userId);
            if (!userToAdd.isStaff) resolve(getGraphQLOutput("failed", "Cannot add a non staff user"));

            kratosQueries.getChannel([channelId], "id=$1", result => {
                if (result.err) return resolve(getGraphQLOutput("failed", JSON.stringify(result.err), null));
                if (result.res.length == 0) return resolve(getGraphQLOutput("failed", "Channel not found", null));
                shiftQueries.getShiftGroupById([shiftGroupId], result => {
                    if (result.err) return resolve(getGraphQLOutput("failed", "Failed to fetch shift group"));
                    if (result.res.length == 0) return resolve(getGraphQLOutput("failed", "Shift group not found"));
                    shiftQueries.getShiftGroupMemberByUserId([userId], result => {
                        if (result.err) return resolve(getGraphQLOutput("failed", "Failed to fetch shift group members"));
                        if (result.res.length != 0) return resolve(getGraphQLOutput("failed", "Member already in group"));
                        shiftQueries.createShiftGroupMember([channelId, shiftGroupId, userId, -1], result => {
                            if (result.err) return resolve(getGraphQLOutput("failed", "Failed to add user to shift group"));
                            return resolve(getGraphQLOutput("success", "User added to shift group"));
                        });
                    });
                });
            });
        } catch (err) {
            resolve(getGraphQLOutput("failed", err));
        }
    });
}
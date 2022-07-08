const kratosQueries = require("../../../postgres/kratos-queries");
const shiftQueries = require("../../../postgres/shift-queries");
const { checkAuthorization, userPermissionGroupHasAccess, getGraphQLUserById } = require('../lib');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message, "INVALID", null));

        let channelId = args.channelId;
        let shiftGroupId = args.shiftGroupId;
        let userId = args.userId;

        if (authUser.userPermissions.find(permission => permission.code == "MANAGE_STAFF")) {
            resolve(await shiftGroupMemberAdd(channelId, shiftGroupId, userId));
        } else if (userPermissionGroupHasAccess(authUser.permissionGroups, ["MANAGE_STAFF"])) {
            resolve(await shiftGroupMemberAdd(channelId, shiftGroupId, userId));
        } else {
            resolve(getGraphQLOutput("permission", "You do not have permission to perform this operation", "INVALID", null));
        }
    });
}

function getGraphQLOutput(field, message, code, user = null) {
    return {
        errors: [{
            field,
            message,
            code
        }],
        user
    }
}

function shiftGroupMemberAdd(channelId, shiftGroupId, userId) {
    return new Promise(async resolve => {
        try {
            let userToAdd = await getGraphQLUserById(userId);
            if (!userToAdd.isStaff) resolve(getGraphQLOutput("failed", "Cannot add a non staff user", "INVALID", null));

            kratosQueries.getChannel([channelId], "id=$1", result => {
                if (result.err) return resolve(getGraphQLOutput("channelId", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
                if (result.res.length == 0) return resolve(getGraphQLOutput("channelId", "Channel not found", "NOT_FOUND", null));
                shiftQueries.getShiftGroupById([shiftGroupId], result => {
                    if (result.err) return resolve(getGraphQLOutput("shiftGroupId", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
                    if (result.res.length == 0) return resolve(getGraphQLOutput("shiftGroupId", "Shift group not found", "NOT_FOUND", null));
                    shiftQueries.getShiftGroupMemberByUserId([userId], result => {
                        if (result.err) return resolve(getGraphQLOutput("shiftGroupId", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
                        if (result.res.length != 0) return resolve(getGraphQLOutput("failed", "Member already in group", "INVALID", null));
                        shiftQueries.createShiftGroupMember([channelId, shiftGroupId, userId, -1], async result => {
                            if (result.err) return resolve(getGraphQLOutput("shiftGroupId", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
                            try {
                                let user = await getGraphQLUserById(userId);
                                resolve({
                                    errors: [],
                                    user
                                })
                            } catch (err) {
                                resolve(getGraphQLOutput("user", err, "GRAPHQL_ERROR", null));
                            }
                        });
                    });
                });
            });
        } catch (err) {
            resolve(getGraphQLOutput("failed", err));
        }
    });
}
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
            resolve(await shiftGroupMemberRemove(channelId, shiftGroupId, userId));
        } else if (userPermissionGroupHasAccess(authUser.permissionGroups, ["MANAGE_STAFF"])) {
            resolve(await shiftGroupMemberRemove(channelId, shiftGroupId, userId));
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

function shiftGroupMemberRemove(channelId, shiftGroupId, userId) {
    return new Promise(resolve => {
        shiftQueries.getAssignedShiftsByChannelIdShiftGroupIdAndUserId([channelId, shiftGroupId, userId], async result => {
            if (result.err) return resolve(getGraphQLOutput("channelId, shiftGroupId, userId", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
            let assignedShifts = result.res;
            if (assignedShifts.length == 0) return resolve(await removeMemberFromShiftGroup(channelId, shiftGroupId, userId));
            let isPendingShifts = false;
            for (let shift of assignedShifts) {
                if (shift.end_time != null) {
                    let end_date = new Date(shift.end_time);
                    if (end_date.getTime() > Date.now()) {
                        isPendingShifts = true;
                        break;
                    }
                }
            }
            if (isPendingShifts) return resolve(getGraphQLOutput("isPendingShifts", "member has pending shifts and cannot be removed", "INVALID", null));
            return resolve(await removeMemberFromShiftGroup(channelId, shiftGroupId, userId));
        });
    });
}

function removeMemberFromShiftGroup(channelId, shiftGroupId, userId) {
    return new Promise(async resolve => {
        await deleteAssignedShiftActivitiesInShiftGroup(channelId, shiftGroupId, userId);
        await deleteUserTimeOffsInShiftGroup(channelId, shiftGroupId, userId);
        await deleteAssignedShiftsInShiftGroup(channelId, shiftGroupId, userId);
        await deleteShiftGroupMembersInShiftGroup(channelId, shiftGroupId, userId);
        try {
            let user = await getGraphQLUserById(userId);
            resolve({
                errors: [],
                user
            });
        } catch (err) {
            resolve(getGraphQLOutput("user", err, "GRAPHQL_ERROR", null));
        }
    });
}

function deleteAssignedShiftActivitiesInShiftGroup(channelId, shiftGroupId, userId) {
    return new Promise(resolve => {
        shiftQueries.deleteAssignedShiftActivitiesByChannelIdShiftGroupIdAndUserId([channelId, shiftGroupId, userId], result => {
            if (result.err) return resolve(false);
            resolve(result.res);
        });
    });
}

function deleteUserTimeOffsInShiftGroup(channelId, shiftGroupId, userId) {
    return new Promise(resolve => {
        shiftQueries.deleteUserTimeOffsByChannelIdShiftGroupIdAndUserId([channelId, shiftGroupId, userId], result => {
            if (result.err) return resolve(false);
            resolve(result.res);
        });
    });
}

function deleteAssignedShiftsInShiftGroup(channelId, shiftGroupId, userId) {
    return new Promise(resolve => {
        shiftQueries.deleteAssignedShiftsByChannelIdShiftGroupIdAndUserId([channelId, shiftGroupId, userId], result => {
            if (result.err) return resolve(false);
            resolve(result.res);
        });
    });
}

function deleteShiftGroupMembersInShiftGroup(channelId, shiftGroupId, userId) {
    return new Promise(resolve => {
        shiftQueries.deleteShiftGroupMembersByChannelIdShiftGroupIdAndUserId([channelId, shiftGroupId, userId], result => {
            if (result.err) return resolve(false);
            resolve(result.res);
        });
    });
}
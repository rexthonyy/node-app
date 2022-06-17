const shiftQueries = require("../../postgres/shift-queries");
const { checkAuthorization, userPermissionGroupHasAccess } = require('./lib');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message));

        let channelId = args.channelId;
        let shiftGroupId = args.shiftGroupId;
        let userId = args.userId;

        if (authUser.userPermissions.find(permission => permission.code == "MANAGE_STAFF")) {
            resolve(await shiftGroupMemberRemove(channelId, shiftGroupId, userId));
        } else if (userPermissionGroupHasAccess(authUser.permissionGroups, ["MANAGE_STAFF"])) {
            resolve(await shiftGroupMemberRemove(channelId, shiftGroupId, userId));
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

function shiftGroupMemberRemove(channelId, shiftGroupId, userId) {
    return new Promise(resolve => {
        shiftQueries.getAssignedShiftsByChannelIdShiftGroupIdAndUserId([userId], async result => {
            if (result.err) return resolve(getGraphQLOutput("failed", "Failed to fetch user assigned shifts"));
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
            if (isPendingShifts) return resolve(getGraphQLOutput("failed", "member has pending shifts and cannot be removed"));
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
        resolve(getGraphQLOutput("success", "Shift group member removed"));
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
const shiftQueries = require("../../postgres/shift-queries");
const { checkAuthorization, userPermissionGroupHasAccess } = require('./lib');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message, null));

        let channelId = args.channelId;
        let shiftGroupId = args.shiftGroupId;

        if (authUser.userPermissions.find(permission => permission.code == "MANAGE_STAFF")) {
            resolve(await shiftGroupDelete(channelId, shiftGroupIds));
        } else if (userPermissionGroupHasAccess(authUser.permissionGroups, ["MANAGE_STAFF"])) {
            resolve(await shiftGroupDelete(channelId, shiftGroupIds));
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

function shiftGroupDelete(channelId, shiftGroupId) {
    return new Promise(async resolve => {
        await deleteAssignedShiftActivitiesInShiftGroup(shiftGroupId);
        await deleteOpenShiftActivitiesInShiftGroup(shiftGroupId);
        await deleteUserTimeOffsInShiftGroup(shiftGroupId);
        await deleteAssignedShiftsInShiftGroup(shiftGroupId);
        await deleteOpenShiftsInShiftGroup(shiftGroupId);
        await deleteShiftGroupMembersInShiftGroup(shiftGroupId);
        let shiftGroup = deleteShiftGroup(shiftGroupId);
        let data = {
            channelId: shiftGroup.channel_id,
            shiftGroupId: shiftGroup.id,
            name: shiftGroup.name
        };
        resolve(getGraphQLOutput("success", "Shift group deleted", data));
    });
}

function deleteAssignedShiftActivitiesInShiftGroup(shiftGroupId) {
    return new Promise(resolve => {
        shiftQueries.deleteAssignedShiftActivitiesByShiftGroupId([shiftGroupId], result => {
            if (result.err) return resolve(false);
            resolve(result.res);
        });
    });
}

function deleteOpenShiftActivitiesInShiftGroup(shiftGroupId) {
    return new Promise(resolve => {
        shiftQueries.deleteOpenedShiftActivitiesByShiftGroupId([shiftGroupId], result => {
            if (result.err) return resolve(false);
            resolve(result.res);
        });
    });
}

function deleteUserTimeOffsInShiftGroup(shiftGroupId) {
    return new Promise(resolve => {
        shiftQueries.deleteUserTimeOffsByShiftGroupId([shiftGroupId], result => {
            if (result.err) return resolve(false);
            resolve(result.res);
        });
    });
}

function deleteAssignedShiftsInShiftGroup(shiftGroupId) {
    return new Promise(resolve => {
        shiftQueries.deleteAssignedShiftsByShiftGroupId([shiftGroupId], result => {
            if (result.err) return resolve(false);
            resolve(result.res);
        });
    });
}

function deleteOpenShiftsInShiftGroup(shiftGroupId) {
    return new Promise(resolve => {
        shiftQueries.deleteOpenShiftsByShiftGroupId([shiftGroupId], result => {
            if (result.err) return resolve(false);
            resolve(result.res);
        });
    });
}

function deleteShiftGroupMembersInShiftGroup(shiftGroupId) {
    return new Promise(resolve => {
        shiftQueries.deleteShiftGroupMembersByShiftGroupId([shiftGroupId], result => {
            if (result.err) return resolve(false);
            resolve(result.res);
        });
    });
}

function deleteShiftGroup(shiftGroupId) {
    return new Promise(resolve => {
        shiftQueries.deleteShiftGroupById([shiftGroupId], result => {
            if (result.err) return resolve(false);
            resolve(result.res);
        });
    });
}
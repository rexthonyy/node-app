const shiftQueries = require("../../../postgres/shift-queries");
const { checkAuthorization, userPermissionGroupHasAccess } = require('../lib');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message));

        let channelId = args.channelId;
        let shiftGroupId = args.shiftGroupId;

        if (authUser.userPermissions.find(permission => permission.code == "MANAGE_STAFF")) {
            resolve(await shiftGroupDelete(channelId, shiftGroupId));
        } else if (userPermissionGroupHasAccess(authUser.permissionGroups, ["MANAGE_STAFF"])) {
            resolve(await shiftGroupDelete(channelId, shiftGroupId));
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

function shiftGroupDelete(channelId, shiftGroupId) {
    return new Promise(async resolve => {
        await deleteAssignedShiftActivitiesInShiftGroup(shiftGroupId);
        await deleteOpenShiftActivitiesInShiftGroup(shiftGroupId);
        await deleteUserTimeOffsInShiftGroup(shiftGroupId);
        await deleteAssignedShiftsInShiftGroup(shiftGroupId);
        await deleteOpenShiftsInShiftGroup(shiftGroupId);
        await deleteShiftGroupMembersInShiftGroup(shiftGroupId);
        await deleteShiftGroup(shiftGroupId);
        resolve(getGraphQLOutput("success", "Shift group deleted"));
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
        shiftQueries.deleteOpenShiftActivitiesByShiftGroupId([shiftGroupId], result => {
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
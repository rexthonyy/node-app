const { formatDate } = require("../../libs/util");
const { unpaidBreakValue, colorValue } = require("../../libs/consts");
const shiftQueries = require("../../postgres/shift-queries");
const { checkAuthorization, userPermissionGroupHasAccess, getGraphQLUserById } = require('./lib');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message, null));

        let assignedShiftId = args.assignedShiftId;
        let channelId = args.channelId;
        let shiftGroupId = args.shiftGroupId;

        if (authUser.userPermissions.find(permission => permission.code == "MANAGE_STAFF")) {
            resolve(await assignedShiftMoveToOpen(assignedShiftId, channelId, shiftGroupId));
        } else if (userPermissionGroupHasAccess(authUser.permissionGroups, ["MANAGE_STAFF"])) {
            resolve(await assignedShiftMoveToOpen(assignedShiftId, channelId, shiftGroupId));
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

function assignedShiftMoveToOpen(assignedShiftId, channelId, shiftGroupId) {
    return new Promise(resolve => {
        shiftQueries.getShiftGroupById([shiftGroupId], async result => {
            if (result.err) return resolve(getGraphQLOutput("failed", result.err, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("failed", "Shift group does not exist", null));
            shiftQueries.getAssignedShifts([assignedShiftId], "id=$1", async result => {
                if (result.err) return resolve(getGraphQLOutput("failed", result.err, null));
                if (result.res.length == 0) return resolve(getGraphQLOutput("failed", "Assigned shift does not exist", null));
                let assignedShift = result.res[0];

                let openShiftId = await moveAssignedShiftToOpenShift(assignedShift);
                await deleteAssignedShift(assignedShiftId);
                await moveAssignedShiftActivitiesToOpenShift(openShiftId, assignedShiftId);
                await deleteAssignedShiftActivities(assignedShiftId);
                let openShift = await getGraphQLOpenShift(openShiftId);
                resolve(getGraphQLOutput("success", "Assigned shift moved to openshift", openShift));
            });
        });
    });
}

function moveAssignedShiftToOpenShift(assignedShift) {
    return new Promise(resolve => {
        let values = [
            assignedShift.channel_id,
            assignedShift.shift_group_id,
            assignedShift.label,
            assignedShift.color,
            assignedShift.note,
            1,
            true,
            assignedShift.start_time,
            assignedShift.end_time,
            assignedShift.is24Hours,
            assignedShift.unpaid_break_time
        ];

        shiftQueries.createOpenShift(values, result => {
            if (result.err) { console.log(result.err); return resolve(-1) };
            let openShift = result.res[0];
            resolve(openShift.id);
        });
    });
}

function deleteAssignedShift(assignedShiftId) {
    return new Promise(resolve => {
        shiftQueries.deleteAssignedShift([assignedShiftId], "id=$1", result => {
            resolve();
        });
    });
}

function moveAssignedShiftActivitiesToOpenShift(openShiftId, assignedShiftId) {
    return new Promise(resolve => {
        shiftQueries.getAssignedShiftActivities([assignedShiftId], "assigned_shift_id=$1", result => {
            if (result.err || result.res.length == 0) return resolve();
            let assignedShiftActivities = result.res;
            const numActivities = assignedShiftActivities.length;
            let cursor = -1;

            assignedShiftActivities.forEach(activity => {
                let values = [
                    activity.channel_id,
                    activity.shift_group_id,
                    openShiftId,
                    activity.name,
                    activity.code,
                    activity.color,
                    activity.start_time,
                    activity.end_time,
                    activity.is_paid
                ];

                shiftQueries.createOpenShiftActivity(values, result => {
                    checkComplete();
                });
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numActivities) {
                    resolve();
                }
            }
        });
    });
}

function deleteAssignedShiftActivities(assignedShiftId) {
    return new Promise(resolve => {
        shiftQueries.deleteAssignedShiftActivities([assignedShiftId], "assigned_shift_id=$1", result => {
            resolve();
        });
    });
}

function getGraphQLOpenShift(openShiftId) {
    return new Promise(resolve => {
        shiftQueries.getOpenShifts([openShiftId], "id=$1", async result => {
            if (result.err) return resolve(getGraphQLOutput("failed", result.err, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("failed", "Open shift does not exist", null));
            let openShift = result.res[0];

            shiftQueries.getOpenShiftActivities([openShiftId], "open_shift_id=$1", result => {
                let openShiftActivities = [];
                if (!result.err && result.res.length > 0) {
                    let activities = result.res;
                    for (let activity of activities) {
                        openShiftActivities.push({
                            id: activity.id,
                            name: activity.name,
                            code: activity.code,
                            color: activity.color,
                            startTime: activity.start_time,
                            endTime: activity.end_time,
                            isPaid: activity.is_paid
                        });
                    }
                }

                resolve({
                    id: openShift.id,
                    label: openShift.label,
                    note: openShift.note,
                    color: openShift.color,
                    startTime: openShift.start_time,
                    endTime: openShift.end_time,
                    break: openShift.unpaid_break_time,
                    is24Hours: openShift.is24Hours,
                    subshifts: openShiftActivities,
                    slots: openShift.slots
                });
            });
        });
    });
}
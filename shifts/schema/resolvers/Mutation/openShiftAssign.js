const { formatDate } = require("../../../libs/util");
const { unpaidBreakValue, colorValue } = require("../../../libs/consts");
const shiftQueries = require("../../../postgres/shift-queries");
const { checkAuthorization, userPermissionGroupHasAccess, getGraphQLUserById } = require('../lib');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message, null));

        let channelId = args.channelId;
        let shiftGroupId = args.shiftGroupId;
        let openShiftId = args.openShiftId;
        let userId = args.userId;

        if (authUser.userPermissions.find(permission => permission.code == "MANAGE_STAFF")) {
            resolve(await openShiftAssign(channelId, shiftGroupId, openShiftId, userId));
        } else if (userPermissionGroupHasAccess(authUser.permissionGroups, ["MANAGE_STAFF"])) {
            resolve(await openShiftAssign(channelId, shiftGroupId, openShiftId, userId));
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

function openShiftAssign(channelId, shiftGroupId, openShiftId, userId) {
    return new Promise(resolve => {
        shiftQueries.getShiftGroupById([shiftGroupId], async result => {
            if (result.err) return resolve(getGraphQLOutput("failed", result.err, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("failed", "Shift group does not exist", null));
            shiftQueries.getOpenShifts([openShiftId], "id=$1", async result => {
                if (result.err) return resolve(getGraphQLOutput("failed", result.err, null));
                if (result.res.length == 0) return resolve(getGraphQLOutput("failed", "Open shift does not exist", null));
                let openShift = result.res[0];

                let assignedShiftId = await assignOpenShiftToUser(openShift, userId);
                await assignOpenShiftActivitiesToUser(openShift.id, assignedShiftId, userId);
                await updateOpenShiftAssign(openShift);
                let assignedShift = await getGraphQLAssignedShift(assignedShiftId);
                resolve(getGraphQLOutput("success", "Open shift has been assigned to user", assignedShift));
            });
        });
    });
}

function assignOpenShiftToUser(openShift, userId) {
    return new Promise(resolve => {
        let values = [
            openShift.channel_id,
            openShift.shift_group_id,
            userId,
            openShift.label,
            openShift.color,
            openShift.note,
            false,
            false,
            openShift.start_time,
            openShift.end_time,
            openShift.is24hours,
            openShift.unpaid_break_time
        ];

        shiftQueries.createAssignedShift(values, result => {
            if (result.err) { console.log(result.err); return resolve(-1) };
            let assignedShift = result.res[0];
            resolve(assignedShift.id);
        });
    });
}

function assignOpenShiftActivitiesToUser(openShiftId, assignedShiftId, userId) {
    return new Promise(resolve => {
        shiftQueries.getOpenShiftActivities([openShiftId], "open_shift_id=$1", result => {
            if (result.err || result.res.length == 0) return resolve();
            let openShiftActivities = result.res;
            const numActivities = openShiftActivities.length;
            let cursor = -1;

            openShiftActivities.forEach(activity => {
                let values = [
                    activity.channel_id,
                    activity.shift_group_id,
                    assignedShiftId,
                    userId,
                    activity.name,
                    activity.code,
                    activity.color,
                    activity.start_time,
                    activity.end_time,
                    activity.is_paid
                ];

                shiftQueries.createAssignedShiftActivity(values, result => {
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

function updateOpenShiftAssign(openShift) {
    return new Promise(resolve => {
        openShift.slots--;
        if (openShift.slots <= 0) {
            shiftQueries.deleteOpenShiftActivities([openShift.id], "open_shift_id=$1", result => {
                shiftQueries.deleteOpenShift([openShift.id], "id=$1", result => {
                    resolve();
                });
            });
        } else {
            shiftQueries.updateOpenShift([openShift.id, openShift.slots], "slots=$2", "id=$1", result => {
                if (result.err) console.log(result.err);
                resolve();
            });
        }
    });
}

function getGraphQLAssignedShift(assignedShiftId) {
    return new Promise(resolve => {
        shiftQueries.getAssignedShifts([assignedShiftId], "id=$1", result => {
            if (result.err) return resolve([]);
            let assignedShift = result.res[0];

            shiftQueries.getAssignedShiftActivities([assignedShiftId], "assigned_shift_id=$1", result => {
                let assignedShiftActivities = [];
                if (!result.err && result.res.length > 0) {
                    let activities = result.res;
                    for (let activity of activities) {
                        assignedShiftActivities.push({
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
                    id: assignedShift.id,
                    type: "shift",
                    label: assignedShift.label,
                    note: assignedShift.note,
                    color: assignedShift.color,
                    startTime: assignedShift.start_time,
                    endTime: assignedShift.end_time,
                    break: assignedShift.unpaid_break_time,
                    is24Hours: assignedShift.is24Hours,
                    subshifts: assignedShiftActivities
                });
            });
        });
    });
}
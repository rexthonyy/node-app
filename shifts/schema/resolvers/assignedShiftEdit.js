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
        let color = args.color;
        let label = args.label;
        let note = args.note || "";
        let is24Hours = args.is24Hours;
        let startTime = new Date(args.startTime);
        let endTime = new Date(args.endTime);
        let unpaidBreak = args.break;
        let shiftActivities = args.shiftActivities || [];

        if (authUser.userPermissions.find(permission => permission.code == "MANAGE_STAFF")) {
            resolve(await assignedShiftEdit(assignedShiftId, channelId, shiftGroupId, color, label, note, is24Hours, startTime, endTime, unpaidBreak, shiftActivities));
        } else if (userPermissionGroupHasAccess(authUser.permissionGroups, ["MANAGE_STAFF"])) {
            resolve(await assignedShiftEdit(assignedShiftId, channelId, shiftGroupId, color, label, note, is24Hours, startTime, endTime, unpaidBreak, shiftActivities));
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

function assignedShiftEdit(assignedShiftId, channelId, shiftGroupId, color, label, note, is24Hours, startTime, endTime, unpaidBreak, shiftActivities) {
    return new Promise(resolve => {
        shiftQueries.getShiftGroupById([shiftGroupId], async result => {
            if (result.err) return resolve(getGraphQLOutput("failed", result.err, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("failed", "Shift group does not exist", null));
            shiftQueries.getAssignedShifts([assignedShiftId], "id=$1", result => {
                if (result.err) return resolve(getGraphQLOutput("failed", result.err, null));
                if (result.res.length == 0) return resolve(getGraphQLOutput("failed", "Assigned shift does not exist", null));
                let userId = result.res[0].user_id;

                let values = [
                    assignedShiftId,
                    label,
                    colorValue[color],
                    note,
                    formatDate(startTime),
                    formatDate(endTime),
                    is24Hours,
                    unpaidBreakValue[unpaidBreak],
                ];

                shiftQueries.updateAssignedShift(values, "label=$2, color=$3, note=$4, start_time=$5, end_time=$6, is24Hours=$7, unpaid_break_time=$8", "id=$1", result => {
                    if (result.err) { console.log(result.err); return resolve(getGraphQLOutput("failed", "Failed to update assigned shift", null)) };
                    shiftQueries.deleteAssignedShiftActivities([assignedShiftId], "assigned_shift_id=$1", result => {
                        const numAssignedShiftActivities = shiftActivities.length;
                        let cursor = -1;

                        shiftActivities.forEach(activity => {
                            values = [
                                channelId,
                                shiftGroupId,
                                assignedShiftId,
                                userId,
                                activity.name,
                                activity.code,
                                colorValue[activity.color],
                                activity.startTime,
                                activity.endTime,
                                activity.isPaid
                            ];

                            shiftQueries.createAssignedShiftActivity(values, result => {
                                checkComplete();
                            });
                        });

                        checkComplete();

                        async function checkComplete() {
                            cursor++;
                            if (cursor == numAssignedShiftActivities) {
                                let shift = await getGraphQLAssignedShift(assignedShiftId);
                                resolve(getGraphQLOutput("success", "Assigned shift updated", shift));
                            }
                        }
                    });
                });
            });
        });
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
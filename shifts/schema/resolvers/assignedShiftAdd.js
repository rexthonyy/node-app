const { formatDate } = require("../../libs/util");
const { unpaidBreakValue, colorValue } = require("../../libs/consts");
const shiftQueries = require("../../postgres/shift-queries");
const { checkAuthorization, userPermissionGroupHasAccess, getGraphQLUserById } = require('./lib');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message, null));

        let channelId = args.channelId;
        let shiftGroupId = args.shiftGroupId;
        let userId = args.userId;
        let color = args.color;
        let label = args.label;
        let note = args.note || "";
        let is24Hours = args.is24Hours;
        let startTime = new Date(args.startTime);
        let endTime = new Date(args.endTime);
        let unpaidBreak = args.break;
        let shiftActivities = args.shiftActivities || [];

        if (authUser.userPermissions.find(permission => permission.code == "MANAGE_STAFF")) {
            resolve(await assignedShiftAdd(channelId, shiftGroupId, userId, color, label, note, is24Hours, startTime, endTime, unpaidBreak, shiftActivities));
        } else if (userPermissionGroupHasAccess(authUser.permissionGroups, ["MANAGE_STAFF"])) {
            resolve(await assignedShiftAdd(channelId, shiftGroupId, userId, color, label, note, is24Hours, startTime, endTime, unpaidBreak, shiftActivities));
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

function assignedShiftAdd(channelId, shiftGroupId, userId, color, label, note, is24Hours, startTime, endTime, unpaidBreak, shiftActivities) {
    return new Promise(resolve => {
        shiftQueries.getShiftGroupById([shiftGroupId], async result => {
            if (result.err) return resolve(getGraphQLOutput("failed", result.err, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("failed", "Shift group does not exist", null));
            try {
                let user = await getGraphQLUserById(userId);
            } catch (err) {
                return resolve(getGraphQLOutput("failed", err, null));
            }

            let values = [
                channelId,
                shiftGroupId,
                userId,
                label,
                colorValue[color],
                note,
                false,
                false,
                formatDate(startTime),
                formatDate(endTime),
                is24Hours,
                unpaidBreakValue[unpaidBreak],
            ];
            shiftQueries.createAssignedShift(values, result => {
                if (result.err) { console.log(result.err); return resolve(getGraphQLOutput("failed", "Failed to create assigned shift", null)) };
                let assignedShift = result.res[0];
                let assignedShiftId = assignedShift.id;
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
                        resolve(getGraphQLOutput("success", "Assigned shift created", shift));
                    }
                }

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
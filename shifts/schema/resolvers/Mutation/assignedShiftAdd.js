const { formatDate } = require("../../../libs/util");
const { unpaidBreakValue, colorValue } = require("../../../libs/consts");
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
            resolve(getGraphQLOutput("failed", "You do not have permission to perform this operation", "INVALID", null));
        }
    });
}

function getGraphQLOutput(field, message, code, shift = null) {
    return {
        errors: [{
            field,
            message,
            code
        }],
        shift
    }
}

function assignedShiftAdd(channelId, shiftGroupId, userId, color, label, note, is24Hours, startTime, endTime, unpaidBreak, shiftActivities) {
    return new Promise(resolve => {
        kratosQueries.getChannel([channelId], "id=$1", result => {
            if (result.err) return resolve(getGraphQLOutput("channelId", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("channelId", "Channel not found", "NOT_FOUND", null));

            shiftQueries.getShiftGroupById([shiftGroupId], async result => {
                if (result.err) return resolve(getGraphQLOutput("shiftGroupId", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
                if (result.res.length == 0) return resolve(getGraphQLOutput("shiftGroupId", "Shift group does not exist", "NOT_FOUND", null));
                try {
                    await getGraphQLUserById(userId);
                } catch (err) {
                    return resolve(getGraphQLOutput("userId", err, "REQUIRED", null));
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
                    if (result.err) { console.log(result.err); return resolve(getGraphQLOutput("assignedshift", JSON.stringify(result.err), "GRAPHQL_ERROR", null)) };
                    if (result.res.length == 0) return resolve(getGraphQLOutput("assignedshift", "Failed to create assigned shift", "REQUIRED", null));
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
                            resolve({
                                errors: [],
                                assignedShift: shift
                            });
                        }
                    }

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
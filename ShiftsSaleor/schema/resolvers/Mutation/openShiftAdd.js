const { formatDate } = require("../../../libs/util");
const { unpaidBreakValue, colorValue } = require("../../../libs/consts");
const kratosQueries = require("../../../postgres/kratos-queries");
const shiftQueries = require("../../../postgres/shift-queries");
const { checkAuthorization, userPermissionGroupHasAccess, getGraphQLUserById } = require('../lib');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message, null));

        let channelId = args.channelId;
        let shiftGroupId = args.shiftGroupId;
        let slots = args.slots;
        let color = args.color;
        let label = args.label;
        let note = args.note || "";
        let is24Hours = args.is24Hours;
        let startTime = new Date(args.startTime);
        let endTime = new Date(args.endTime);
        let unpaidBreak = args.break;
        let shiftActivities = args.shiftActivities || [];

        if (authUser.userPermissions.find(permission => permission.code == "MANAGE_STAFF")) {
            resolve(await openShiftAdd(channelId, shiftGroupId, slots, color, label, note, is24Hours, startTime, endTime, unpaidBreak, shiftActivities));
        } else if (userPermissionGroupHasAccess(authUser.permissionGroups, ["MANAGE_STAFF"])) {
            resolve(await openShiftAdd(channelId, shiftGroupId, slots, color, label, note, is24Hours, startTime, endTime, unpaidBreak, shiftActivities));
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

function openShiftAdd(channelId, shiftGroupId, slots, color, label, note, is24Hours, startTime, endTime, unpaidBreak, shiftActivities) {
    return new Promise(resolve => {
        kratosQueries.getChannel([channelId], "id=$1", result => {
            if (result.err) return resolve(getGraphQLOutput("failed", result.err, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("failed", "Channel not found", null));

            shiftQueries.getShiftGroupById([shiftGroupId], async result => {
                if (result.err) return resolve(getGraphQLOutput("failed", result.err, null));
                if (result.res.length == 0) return resolve(getGraphQLOutput("failed", "Shift group does not exist", null));

                let values = [
                    channelId,
                    shiftGroupId,
                    label,
                    colorValue[color],
                    note,
                    slots,
                    true,
                    formatDate(startTime),
                    formatDate(endTime),
                    is24Hours,
                    unpaidBreakValue[unpaidBreak],
                ];
                shiftQueries.createOpenShift(values, result => {
                    if (result.err) { console.log(result.err); return resolve(getGraphQLOutput("failed", "Failed to create open shift", null)) };
                    let openShift = result.res[0];
                    let openShiftId = openShift.id;
                    const numopenShiftActivities = shiftActivities.length;
                    let cursor = -1;

                    shiftActivities.forEach(activity => {
                        values = [
                            channelId,
                            shiftGroupId,
                            openShiftId,
                            activity.name,
                            activity.code,
                            colorValue[activity.color],
                            activity.startTime,
                            activity.endTime,
                            activity.isPaid
                        ];

                        shiftQueries.createOpenShiftActivity(values, result => {
                            checkComplete();
                        });
                    });

                    checkComplete();

                    async function checkComplete() {
                        cursor++;
                        if (cursor == numopenShiftActivities) {
                            let shift = await getGraphQLOpenShift(openShiftId);
                            resolve(getGraphQLOutput("success", "Open shift created", shift));
                        }
                    }

                });
            });
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
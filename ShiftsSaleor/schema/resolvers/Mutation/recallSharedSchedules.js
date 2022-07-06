const { formatDate } = require("../../../libs/util");
const { unpaidBreakValue, colorValue, requestType, requestStatus } = require("../../../libs/consts");
const shiftQueries = require("../../../postgres/shift-queries");
const { checkAuthorization, userPermissionGroupHasAccess, getGraphQLUserById } = require('../lib');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message));

        let channelId = args.channelId;
        let startTime = new Date(args.startTime);
        let endTime = new Date(args.endTime);

        if (authUser.userPermissions.find(permission => permission.code == "MANAGE_STAFF")) {
            resolve(await recallSharedSchedules(channelId, startTime, endTime));
        } else if (userPermissionGroupHasAccess(authUser.permissionGroups, ["MANAGE_STAFF"])) {
            resolve(await recallSharedSchedules(channelId, startTime, endTime));
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

function recallSharedSchedules(channelId, startTime, endTime) {
    return new Promise(resolve => {
        shiftQueries.getSharedSchedules([channelId, formatDate(startTime), formatDate(endTime)], "channel_id=$1 AND start_time >= $2 AND end_time <= $3", result => {
            if (result.err) return resolve(getGraphQLOutput("failed", result.err));
            let sharedSchedules = result.res;
            const numSchedules = sharedSchedules.length;
            let cursor = -1;

            sharedSchedules.forEach(async schedule => {
                let scheduleId = schedule.id;
                let assignedShiftId = schedule.assigned_shift_id;
                await updateAssignedShift(assignedShiftId);
                await deleteSharedSchedule(scheduleId);
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numSchedules) {
                    resolve(getGraphQLOutput("success", "Schedules recalled"));
                }
            }
        });
    });
}

function updateAssignedShift(assignedShiftId) {
    return new Promise(resolve => {
        shiftQueries.updateAssignedShift([assignedShiftId, false], "is_shared=$2", "id=$1", result => {
            resolve();
        });
    });
}

function deleteSharedSchedule(scheduleId) {
    return new Promise(resolve => {
        shiftQueries.deleteSharedSchedule([scheduleId], "id=$1", result => {
            resolve();
        });
    });
}
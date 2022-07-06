const shiftQueries = require("../../../postgres/shift-queries");
const { checkAuthorization } = require('../lib');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message, null));

        let channelId = args.channelId;
        let shiftGroupId = args.shiftGroupId;

        if (authUser.userPermissions.find(permission => permission.code == "MANAGE_STAFF")) {
            resolve(await getAllUniqueShifts(channelId, shiftGroupId));
        } else if (userPermissionGroupHasAccess(authUser.permissionGroups, ["MANAGE_STAFF"])) {
            resolve(await getAllUniqueShifts(channelId, shiftGroupId));
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

function getAllUniqueShifts(channelId, shiftGroupId) {
    return new Promise(async resolve => {
        let openShifts = await getOpenShifts(channelId, shiftGroupId);
        let assignedShifts = await getAssignedShifts(channelId, shiftGroupId);
        resolve(getGraphQLOutput("success", "Fetch successful", { openShifts, assignedShifts }));
    });
}

function getOpenShifts(channelId, shiftGroupId) {
    return new Promise(resolve => {
        shiftQueries.getOpenShifts([channelId, shiftGroupId], "channel_id=$1 AND shift_group_id=$2", async result => {
            let shifts = [];
            if (!result.err && result.res.length > 0) {
                let openShifts = result.res;
                const numberOfShifts = openShifts.length;
                let cursor = -1;

                openShifts.forEach(openShift => {
                    shifts.push({
                        id: openShift.id,
                        label: openShift.label,
                        note: openShift.note,
                        color: openShift.color,
                        startTime: openShift.start_time,
                        endTime: openShift.end_time,
                        break: openShift.unpaid_break_time,
                        is24Hours: openShift.is24Hours,
                        subshifts: null,
                        slots: openShift.slots
                    });

                    checkComplete();
                });

                checkComplete();

                function checkComplete() {
                    cursor++;
                    if (cursor == numberOfShifts) {
                        resolve(shifts);
                    }
                }
            } else {
                resolve(shifts);
            }
        });
    });
}

function getAssignedShifts(channelId, shiftGroupId) {
    return new Promise(resolve => {
        let shifts = [];
        shiftQueries.getAssignedShifts([channelId, shiftGroupId], "channel_id=$1 AND shift_group_id=$2", result => {
            if (result.err || result.res.length == 0) return resolve(shifts);
            let assignedShifts = result.res;
            const numShifts = assignedShifts.length;
            let cursor = -1;

            assignedShifts.forEach(assignedShift => {
                shifts.push({
                    id: assignedShift.id,
                    type: "shift",
                    label: assignedShift.label,
                    note: assignedShift.note,
                    color: assignedShift.color,
                    startTime: assignedShift.start_time,
                    endTime: assignedShift.end_time,
                    break: assignedShift.unpaid_break_time,
                    is24Hours: assignedShift.is24Hours,
                    subshifts: null
                });
                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numShifts) {
                    resolve(shifts);
                }
            }
        });
    });
}
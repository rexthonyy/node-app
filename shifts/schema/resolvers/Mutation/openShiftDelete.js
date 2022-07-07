const shiftQueries = require("../../../postgres/shift-queries");
const { checkAuthorization, userPermissionGroupHasAccess, getGraphQLUserById } = require('../lib');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message, "INVALID", null));

        let channelId = args.channelId;
        let shiftGroupId = args.shiftGroupId;
        let openShiftId = args.openShiftId;

        if (authUser.userPermissions.find(permission => permission.code == "MANAGE_STAFF")) {
            resolve(await openShiftDelete(openShiftId, channelId, shiftGroupId));
        } else if (userPermissionGroupHasAccess(authUser.permissionGroups, ["MANAGE_STAFF"])) {
            resolve(await openShiftDelete(openShiftId, channelId, shiftGroupId));
        } else {
            resolve(getGraphQLOutput("permission", "You do not have permission to perform this operation", "GRAPHQL_ERROR", null));
        }
    });
}

function getGraphQLOutput(field, message, code, openShift = null) {
    return {
        errors: [{
            field,
            message,
            code
        }],
        openShift
    }
}

function openShiftDelete(openShiftId, channelId, shiftGroupId) {
    return new Promise(resolve => {
        shiftQueries.getShiftGroupById([shiftGroupId], async result => {
            if (result.err) return resolve(getGraphQLOutput("shiftGroupId", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("failed", "Shift group not found", "NOT_FOUND", null));
            shiftQueries.getOpenShifts([openShiftId], "id=$1", async result => {
                if (result.err) return resolve(getGraphQLOutput("openShiftId", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
                if (result.res.length == 0) return resolve(getGraphQLOutput("openShiftId", "open shift does not exist", "NOT_FOUND", null));
                try {
                    let shift = await getGraphQLOpenShift(openShiftId);
                    shiftQueries.deleteOpenShiftActivities([openShiftId], "open_shift_id=$1", result => {
                        shiftQueries.deleteOpenShift([openShiftId], "id=$1", result => {
                            resolve({
                                errors: [],
                                openShift: shift
                            });
                        });
                    });
                } catch (err) {
                    return resolve(getGraphQLOutput("openshift", err, "GRAPHQL_ERROR", null));
                }
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
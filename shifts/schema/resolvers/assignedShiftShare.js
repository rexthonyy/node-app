const { formatDate } = require("../../libs/util");
const { unpaidBreakValue, colorValue } = require("../../libs/consts");
const shiftQueries = require("../../postgres/shift-queries");
const { checkAuthorization, userPermissionGroupHasAccess, getGraphQLUserById } = require('./lib');
const getGraphQLAssignedShift = require("./lib/getGraphQLAssignedShift");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message, null));

        let assignedShiftId = args.assignedShiftId;
        let channelId = args.channelId;
        let shiftGroupId = args.shiftGroupId;

        if (authUser.userPermissions.find(permission => permission.code == "MANAGE_STAFF")) {
            resolve(await assignedShiftShare(assignedShiftId, channelId, shiftGroupId));
        } else if (userPermissionGroupHasAccess(authUser.permissionGroups, ["MANAGE_STAFF"])) {
            resolve(await assignedShiftShare(assignedShiftId, channelId, shiftGroupId));
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

function assignedShiftShare(assignedShiftId, channelId, shiftGroupId) {
    return new Promise(resolve => {
        shiftQueries.getShiftGroupById([shiftGroupId], async result => {
            if (result.err) return resolve(getGraphQLOutput("failed", result.err, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("failed", "Shift group does not exist", null));
            shiftQueries.getAssignedShifts([assignedShiftId], "id=$1", async result => {
                if (result.err) return resolve(getGraphQLOutput("failed", result.err, null));
                if (result.res.length == 0) return resolve(getGraphQLOutput("failed", "Assigned shift does not exist", null));
                let assignedShift = result.res[0];

                await copyAssignedShiftToSharedSchedules(assignedShift);
                await updateAssignedShift(assignedShift.id);
                let graphQLAssignedShift = await getGraphQLAssignedShift(assignedShift.id);
                resolve(getGraphQLOutput("success", "Assigned shift added to shared schedule", graphQLAssignedShift));
            });
        });
    });
}

function copyAssignedShiftToSharedSchedules(assignedShift) {
    return new Promise(resolve => {
        let values = [
            assignedShift.channel_id,
            assignedShift.shift_group_id,
            assignedShift.id,
            assignedShift.user_id,
            assignedShift.label,
            assignedShift.color,
            assignedShift.note,
            false,
            assignedShift.start_time,
            assignedShift.end_time,
            assignedShift.is24hours,
            assignedShift.unpaid_break_time
        ];

        shiftQueries.createSharedSchedule(values, result => {
            if (result.err) { console.log(result.err); return resolve(-1) };
            let sharedSchedule = result.res[0];
            resolve(sharedSchedule.id);
        });
    });
}

function updateAssignedShift(assignedShiftId) {
    return new Promise(resolve => {
        shiftQueries.updateAssignedShift([assignedShiftId, true], "is_shared=$2", "id=$1", result => {
            if (result.err) { console.log(result.err); return resolve() };
            resolve();
        });
    });
}
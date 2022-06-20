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

        if (authUser.userPermissions.find(permission => permission.code == "MANAGE_STAFF")) {
            resolve(await timeOffAdd(channelId, shiftGroupId, userId, color, label, note, is24Hours, startTime, endTime));
        } else if (userPermissionGroupHasAccess(authUser.permissionGroups, ["MANAGE_STAFF"])) {
            resolve(await timeOffAdd(channelId, shiftGroupId, userId, color, label, note, is24Hours, startTime, endTime));
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

function timeOffAdd(channelId, shiftGroupId, userId, color, label, note, is24Hours, startTime, endTime) {
    return new Promise(resolve => {
        shiftQueries.getShiftGroupById([shiftGroupId], async result => {
            if (result.err) return resolve(getGraphQLOutput("failed", result.err, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("failed", "Shift group does not exist", null));

            let values = [
                channelId,
                shiftGroupId,
                userId,
                label,
                colorValue[color],
                note,
                formatDate(startTime),
                formatDate(endTime),
                is24Hours
            ];
            shiftQueries.createUserTimeOff(values, async result => {
                if (result.err) { console.log(result.err); return resolve(getGraphQLOutput("failed", "Failed to create user time off", null)) };
                let userTimeOffId = result.res[0].id;
                let userTimeoff = await getGraphQLUserTimeOff(userTimeOffId);
                resolve(getGraphQLOutput("success", "User time off created", userTimeoff));
            });
        });
    });
}

function getGraphQLUserTimeOff(userTimeoffId) {
    return new Promise(resolve => {
        shiftQueries.getUserTimeOffs([userTimeoffId], "id=$1", async result => {
            if (result.err) return resolve(getGraphQLOutput("failed", result.err, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("failed", "User time offs does not exist", null));
            let timeoff = result.res[0];

            resolve({
                id: timeoff.id,
                type: "requestTimeoff",
                label: timeoff.label,
                note: timeoff.note,
                color: timeoff.color,
                startTime: timeoff.start_time,
                endTime: timeoff.end_time,
                is24Hours: timeoff.is24hours
            });
        });
    });
}
const { formatDate } = require("../../../libs/util");
const { unpaidBreakValue, colorValue } = require("../../../libs/consts");
const shiftQueries = require("../../../postgres/shift-queries");
const { checkAuthorization, userPermissionGroupHasAccess, getGraphQLUserById } = require('../lib');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return reject(message);

        let channelId = args.channelId;
        let shiftGroupId = args.shiftGroupId;
        let timeOffId = args.timeOffId;
        let color = args.color;
        let label = args.label;
        let note = args.note || "";
        let is24Hours = args.is24Hours;
        let startTime = new Date(args.startTime);
        let endTime = new Date(args.endTime);

        if (authUser.userPermissions.find(permission => permission.code == "MANAGE_STAFF")) {
            resolve(await timeOffEdit(channelId, shiftGroupId, timeOffId, color, label, note, is24Hours, startTime, endTime));
        } else if (userPermissionGroupHasAccess(authUser.permissionGroups, ["MANAGE_STAFF"])) {
            resolve(await timeOffEdit(channelId, shiftGroupId, timeOffId, color, label, note, is24Hours, startTime, endTime));
        } else {
            resolve(getGraphQLOutput("permission", "You do not have permission to perform this operation", "INVALID", null));
        }
    });
}

function getGraphQLOutput(field, message, code, timeoff = null) {
    return {
        errors: [{
            field,
            message,
            code
        }],
        timeoff
    }
}

function timeOffEdit(channelId, shiftGroupId, timeOffId, color, label, note, is24Hours, startTime, endTime) {
    return new Promise(resolve => {
        shiftQueries.getShiftGroupById([shiftGroupId], async result => {
            if (result.err) return resolve(getGraphQLOutput("shiftGroupId", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("shiftGroupId", "Shift group does not exist", "NOT_FOUND", null));
            shiftQueries.getUserTimeOffs([timeOffId], "id=$1", result => {
                if (result.err) return resolve(getGraphQLOutput("timeOffId", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
                if (result.res.length == 0) return resolve(getGraphQLOutput("timeOffId", "Time off does not exist", "NOT_FOUND", null));

                let values = [
                    timeOffId,
                    label,
                    colorValue[color],
                    note,
                    formatDate(startTime),
                    formatDate(endTime),
                    is24Hours
                ];

                shiftQueries.updateTimeOff(values, "label=$2, color=$3, note=$4, start_time=$5, end_time=$6, is24hours=$7", "id=$1", async result => {
                    if (result.err) return resolve(getGraphQLOutput("values", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
                    let userTimeoff = await getGraphQLUserTimeOff(timeOffId);
                    resolve({
                        errors: [],
                        timeoff: userTimeoff
                    });
                });
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
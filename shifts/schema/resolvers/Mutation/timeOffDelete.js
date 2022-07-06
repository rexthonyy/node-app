const shiftQueries = require("../../../postgres/shift-queries");
const { checkAuthorization, userPermissionGroupHasAccess, getGraphQLUserById } = require('../lib');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message, null));

        let channelId = args.channelId;
        let shiftGroupId = args.shiftGroupId;
        let timeOffId = args.timeOffId;

        if (authUser.userPermissions.find(permission => permission.code == "MANAGE_STAFF")) {
            resolve(await timeOffDelete(timeOffId, channelId, shiftGroupId));
        } else if (userPermissionGroupHasAccess(authUser.permissionGroups, ["MANAGE_STAFF"])) {
            resolve(await timeOffDelete(timeOffId, channelId, shiftGroupId));
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

function timeOffDelete(timeOffId, channelId, shiftGroupId) {
    return new Promise(resolve => {
        shiftQueries.getShiftGroupById([shiftGroupId], async result => {
            if (result.err) return resolve(getGraphQLOutput("failed", result.err, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("failed", "Shift group does not exist", null));
            shiftQueries.getUserTimeOffs([timeOffId], "id=$1", async result => {
                if (result.err) return resolve(getGraphQLOutput("failed", result.err, null));
                if (result.res.length == 0) return resolve(getGraphQLOutput("failed", "time off does not exist", null));
                let timeoff = await getGraphQLUserTimeOff(timeOffId);
                shiftQueries.deleteUserTimeOffs([timeOffId], "id=$1", result => {
                    resolve(getGraphQLOutput("success", "Timeoff deleted", timeoff));
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
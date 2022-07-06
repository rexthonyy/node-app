const { formatDate } = require("../../../libs/util");
const shiftQueries = require("../../../postgres/shift-queries");
const { checkAuthorization, userPermissionGroupHasAccess } = require('../lib');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message, null));

        let channelId = args.channelId;
        let startTime = new Date(args.startTime);
        let endTime = new Date(args.endTime);

        if (authUser.userPermissions.find(permission => permission.code == "MANAGE_STAFF")) {
            resolve(await getDailyNotes(channelId, startTime, endTime));
        } else if (userPermissionGroupHasAccess(authUser.permissionGroups, ["MANAGE_STAFF"])) {
            resolve(await getDailyNotes(channelId, startTime, endTime));
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

function getDailyNotes(channelId, startDate, endDate) {
    return new Promise(async resolve => {
        shiftQueries.getDayNotes([channelId, formatDate(startDate), formatDate(endDate)], "channel_id=$1 AND date >= $2 AND date <= $3", result => {
            if (result.err) return resolve(getGraphQLOutput("failed", result.err, null));
            let notes = result.res;
            const numNotes = notes.length;
            notes.forEach(note => note.numberOfNotes = numNotes);

            resolve({ status: "success", message: "Fetch successful", result: notes });
        });
    });
}
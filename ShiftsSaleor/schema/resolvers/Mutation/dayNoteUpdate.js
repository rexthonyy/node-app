const { formatDate, getDayFromDate } = require("../../../libs/util");
const shiftQueries = require("../../../postgres/shift-queries");
const { checkAuthorization, userPermissionGroupHasAccess, getGraphQLUserById } = require('../lib');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message, null));

        let channelId = args.channelId;
        let note = args.note || "";
        let date = new Date(args.date);

        if (authUser.userPermissions.find(permission => permission.code == "MANAGE_STAFF")) {
            resolve(await dayNoteUpdate(channelId, note, date));
        } else if (userPermissionGroupHasAccess(authUser.permissionGroups, ["MANAGE_STAFF"])) {
            resolve(await dayNoteUpdate(channelId, note, date));
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

function dayNoteUpdate(channelId, note, date) {
    return new Promise(resolve => {
        let day = getDayFromDate(date);
        shiftQueries.getDayNotes([formatDate(day)], "date=$1", result => {
            if (result.err) return resolve(getGraphQLOutput("failed", result.err));
            if (result.res.length == 0) {
                shiftQueries.createDayNote([channelId, note, day], result => {
                    if (result.err) return resolve(getGraphQLOutput("failed", result.err));
                    resolve(getGraphQLOutput("success", "Note updated"));
                });
            } else {
                shiftQueries.updateDayNote([channelId, note, day], "channel_id=$1, note=$2", "date=$3", result => {
                    if (result.err) return resolve(getGraphQLOutput("failed", result.err));
                    resolve(getGraphQLOutput("success", "Note updated"));
                });
            }
        });
    });
}
const { formatDate, getDayFromDate } = require("../../../libs/util");
const shiftQueries = require("../../../postgres/shift-queries");
const { checkAuthorization, userPermissionGroupHasAccess, getGraphQLUserById } = require('../lib');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message, "INVALID", null));

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

function getGraphQLOutput(field, message, code, note = null) {
    return {
        errors: [{
            field,
            message,
            code
        }],
        note
    }
}

function dayNoteUpdate(channelId, note, date) {
    return new Promise(resolve => {
        let day = getDayFromDate(date);
        shiftQueries.getDayNotes([formatDate(day)], "date=$1", result => {
            if (result.err) return resolve(getGraphQLOutput("formatDate(day)", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
            if (result.res.length == 0) {
                shiftQueries.createDayNote([channelId, note, day], result => {
                    if (result.err) return resolve(getGraphQLOutput("channelId, note, day", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
                    if (result.res.length == 0) return resolve(getGraphQLOutput("channelId, note, day", "Failed to create day note", "GRAPHQL_ERROR", null));
                    let dayNote = result.res[0];
                    resolve(getDayNote(dayNote));
                });
            } else {
                shiftQueries.updateDayNote([channelId, note, day], "channel_id=$1, note=$2", "date=$3", result => {
                    if (result.err) return resolve(getGraphQLOutput("channelId, note, day", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
                    if (result.res.length == 0) return resolve(getGraphQLOutput("channelId, note, day", "Failed to update day note", "GRAPHQL_ERROR", null));
                    let dayNote = result.res[0];
                    resolve(getDayNote(dayNote));
                });
            }
        });
    });
}


function getDayNote(note) {
    return {
        errors: [],
        note
    };
}
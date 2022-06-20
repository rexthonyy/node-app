const { requestType, requestStatus } = require("../../libs/consts");
const shiftQueries = require("../../postgres/shift-queries");
const { checkAuthorization, getGraphQLUserById } = require('./lib');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message, null));

        let channelId = args.channelId;
        let assignedShiftId = args.assignedShiftId;
        let groupMemberId = args.groupMemberId;
        let note = args.note || "";

        resolve(await requestCreateOffer(authUser, channelId, assignedShiftId, groupMemberId, note));
    });
}

function getGraphQLOutput(status, message, result) {
    return {
        status,
        message,
        result
    };
}

function requestCreateOffer(authUser, channelId, assignedShiftId, groupMemberId, note) {
    return new Promise(resolve => {
        shiftQueries.createRequest([channelId, authUser.id, -1, requestType.requestOffer], result => {
            if (result.err) return resolve(getGraphQLOutput("failed", result.err, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("failed", "Request could not be created", null));
            let request = result.res[0];

            let values = [
                channelId,
                request.id,
                authUser.id,
                assignedShiftId,
                groupMemberId,
                note,
                requestStatus.pending,
                null,
                null,
                null
            ];

            shiftQueries.createRequestOffer(values, async result => {
                if (result.err) return resolve(getGraphQLOutput("failed", result.err, null));
                if (result.res.length == 0) return resolve(getGraphQLOutput("failed", "Request swap could not be created", null));
                let offer = await getRequestOffer(channelId, request.id);
                resolve(getGraphQLOutput("success", "Request offer created", offer));
            });
        });
    });
}

function getRequestOffer(channelId, requestId) {
    return new Promise(resolve => {
        shiftQueries.getRequestOffer([channelId, requestId], "channel_id=$1 AND request_id=$2", async result => {
            if (!result.err && result.res.length > 0) {
                let offerRequest = result.res[0];
                let user = await getGraphQLUserById(offerRequest.user_id);
                let responseBy = null;
                let shiftToOffer = await getGraphQLAssignedShift(offerRequest.assigned_user_shift_id);
                let shiftOfferedTo = await getGraphQLUserById(offerRequest.offered_to_user_id);
                resolve({
                    id: offerRequest.id,
                    channelId: offerRequest.channel_id,
                    requestId: offerRequest.request_id,
                    user,
                    type: requestType.requestOffer,
                    shiftToOffer,
                    shiftOfferedTo,
                    requestNote: offerRequest.request_note,
                    status: offerRequest.status,
                    responseNote: offerRequest.responseNote,
                    responseBy,
                    responseAt: offerRequest.response_at,
                    createdAt: offerRequest.created_at
                });
            } else {
                resolve("failed to resolve request");
            }
        });
    });
}


function getGraphQLAssignedShift(assignedShiftId) {
    return new Promise(resolve => {
        shiftQueries.getAssignedShifts([assignedShiftId], "id=$1", result => {
            if (result.err) return resolve([]);
            if (result.res.length == 0) return resolve([]);
            let assignedShift = result.res[0];

            shiftQueries.getAssignedShiftActivities([assignedShiftId], "assigned_shift_id=$1", result => {
                let assignedShiftActivities = [];
                if (!result.err && result.res.length > 0) {
                    let activities = result.res;
                    for (let activity of activities) {
                        assignedShiftActivities.push({
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
                    id: assignedShift.id,
                    type: "shift",
                    label: assignedShift.label,
                    note: assignedShift.note,
                    color: assignedShift.color,
                    startTime: assignedShift.start_time,
                    endTime: assignedShift.end_time,
                    break: assignedShift.unpaid_break_time,
                    is24Hours: assignedShift.is24Hours,
                    subshifts: assignedShiftActivities
                });
            });
        });
    });
}
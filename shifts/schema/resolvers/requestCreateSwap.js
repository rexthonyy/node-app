const { requestType, requestStatus } = require("../../libs/consts");
const shiftQueries = require("../../postgres/shift-queries");
const { checkAuthorization, getGraphQLUserById } = require('./lib');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message, null));

        let channelId = args.channelId;
        let assignedShiftId = args.assignedShiftId;
        let groupMemberShiftId = args.groupMemberShiftId;
        let note = args.note || "";

        resolve(await requestCreateSwap(authUser, channelId, assignedShiftId, groupMemberShiftId, note));
    });
}

function getGraphQLOutput(status, message, result) {
    return {
        status,
        message,
        result
    };
}

function requestCreateSwap(authUser, channelId, assignedShiftId, groupMemberShiftId, note) {
    return new Promise(resolve => {
        shiftQueries.createRequest([channelId, authUser.id, -1, requestType.requestSwap], result => {
            if (result.err) return resolve(getGraphQLOutput("failed", result.err, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("failed", "Request could not be created", null));
            let request = result.res[0];

            let values = [
                channelId,
                request.id,
                authUser.id,
                assignedShiftId,
                groupMemberShiftId,
                note,
                requestStatus.pending,
                null,
                null,
                null
            ];

            shiftQueries.createRequestSwap(values, async result => {
                if (result.err) return resolve(getGraphQLOutput("failed", result.err, null));
                if (result.res.length == 0) return resolve(getGraphQLOutput("failed", "Request swap could not be created", null));
                let swap = await getRequestSwap(channelId, request.id);
                resolve(getGraphQLOutput("success", "Request swap created", swap));
            });
        });
    });
}

function getRequestSwap(channelId, requestId) {
    return new Promise(resolve => {
        shiftQueries.getRequestSwap([channelId, requestId], "channel_id=$1 AND request_id=$2", async result => {
            if (!result.err && result.res.length > 0) {
                let swapRequest = result.res[0];
                let user = await getGraphQLUserById(swapRequest.user_id);
                let responseBy = null;
                let shiftToSwap = await getGraphQLAssignedShift(swapRequest.assigned_user_shift_id);
                let toSwapWith = await getGraphQLAssignedShift(swapRequest.assigned_user_shift_id_to_swap);
                resolve({
                    id: swapRequest.id,
                    channelId: swapRequest.channel_id,
                    requestId: swapRequest.request_id,
                    user,
                    type: requestType.requestSwap,
                    shiftToSwap,
                    toSwapWith,
                    requestNote: swapRequest.request_note,
                    status: swapRequest.status,
                    responseNote: swapRequest.responseNote,
                    responseBy,
                    responseAt: swapRequest.response_at,
                    createdAt: swapRequest.created_at
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
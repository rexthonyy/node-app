const shiftQueries = require("../../../postgres/shift-queries");
const { checkAuthorization, getGraphQLUserById } = require('../lib');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message, null));

        let channelId = args.channelId;

        resolve(await getRequests(authUser, channelId));
    });
}

function getGraphQLOutput(status, message, result) {
    return {
        status,
        message,
        result
    };
}

function getRequests(authUser, channelId) {
    return new Promise(async resolve => {
        shiftQueries.getRequests([channelId, authUser.id], "channel_id=$1 AND (user_id=$2 OR receipient_id=$2)", result => {
            if (result.err) return resolve(getGraphQLOutput("failed", result.err, []));
            let requests = result.res;
            const numRequests = requests.length;
            let cursor = -1;
            let shifts = [];

            requests.forEach(request => {
                if (request.type == "requestTimeoff") {
                    shiftQueries.getRequestTimeOff([channelId, request.id], "channel_id=$1 AND request_id=$2", async result => {
                        if (!result.err && result.res.length > 0) {
                            let timeOffRequests = result.res;
                            for (let timeOffRequest of timeOffRequests) {
                                let user;
                                let responseBy;

                                try {
                                    user = await getGraphQLUserById(timeOffRequest.user_id);
                                } catch (err) {
                                    console.log(err);
                                    user = null;
                                }
                                try {
                                    responseBy = await getGraphQLUserById(timeOffRequest.response_by_user_id);
                                } catch (err) {
                                    console.log(err);
                                    responseBy = null;
                                }

                                shifts.push({
                                    id: timeOffRequest.id,
                                    channelId: timeOffRequest.channel_id,
                                    requestId: timeOffRequest.request_id,
                                    user,
                                    type: "TIMEOFF",
                                    isAllDay: timeOffRequest.is_all_day,
                                    startTime: timeOffRequest.start_time,
                                    endTime: timeOffRequest.end_time,
                                    reason: timeOffRequest.reason,
                                    requestNote: timeOffRequest.request_note,
                                    status: timeOffRequest.status,
                                    responseNote: timeOffRequest.responseNote,
                                    responseBy,
                                    responseAt: timeOffRequest.response_at,
                                    createdAt: timeOffRequest.created_at
                                });
                            }
                        }
                        checkComplete();
                    });
                } else if (request.type == "requestSwap") {
                    shiftQueries.getRequestSwap([channelId, request.id], "channel_id=$1 AND request_id=$2", async result => {
                        if (!result.err && result.res.length > 0) {
                            let swapRequests = result.res;
                            for (let swapRequest of swapRequests) {
                                let user;
                                let responseBy;
                                let shiftToSwap;
                                let toSwapWith;
                                try {
                                    user = await getGraphQLUserById(swapRequest.user_id);
                                } catch (err) {
                                    console.log(err);
                                    user = null;
                                }
                                try {
                                    responseBy = await getGraphQLUserById(swapRequest.response_by_user_id);
                                } catch (err) {
                                    console.log(err);
                                    responseBy = null;
                                }
                                try {
                                    shiftToSwap = await getGraphQLAssignedShift(swapRequest.assigned_user_shift_id);
                                } catch (err) {
                                    console.log(err);
                                    shiftToSwap = null;
                                }
                                try {
                                    toSwapWith = await getGraphQLAssignedShift(swapRequest.assigned_user_shift_id_to_swap);
                                } catch (err) {
                                    console.log(err);
                                    toSwapWith = null;
                                }

                                shifts.push({
                                    id: swapRequest.id,
                                    channelId: swapRequest.channel_id,
                                    requestId: swapRequest.request_id,
                                    user,
                                    type: "SWAP",
                                    shiftToSwap,
                                    toSwapWith,
                                    requestNote: swapRequest.request_note,
                                    status: swapRequest.status,
                                    responseNote: swapRequest.responseNote,
                                    responseBy,
                                    responseAt: swapRequest.response_at,
                                    createdAt: swapRequest.created_at
                                });
                            }
                        }
                        checkComplete();
                    });
                } else if (request.type == "requestOffer") {
                    shiftQueries.getRequestOffer([channelId, request.id, "pending"], "channel_id=$1 AND request_id=$2 AND status=$3", async result => {
                        if (!result.err && result.res.length > 0) {
                            let offerRequests = result.res;
                            for (let offerRequest of offerRequests) {
                                let user;
                                let responseBy;
                                let shiftToOffer;
                                let shiftOfferedTo;
                                try {
                                    user = await getGraphQLUserById(offerRequest.user_id);
                                } catch (err) {
                                    console.log(err);
                                    user = null;
                                }
                                try {
                                    responseBy = await getGraphQLUserById(offerRequest.response_by_user_id);
                                } catch (err) {
                                    console.log(err);
                                    responseBy = null;
                                }
                                try {
                                    shiftToOffer = await getGraphQLAssignedShift(offerRequest.assigned_user_shift_id);
                                } catch (err) {
                                    console.log(err);
                                    shiftToOffer = null;
                                }
                                try {
                                    shiftOfferedTo = await getGraphQLUserById(offerRequest.offered_to_user_id);
                                } catch (err) {
                                    console.log(err);
                                    shiftOfferedTo = null;
                                }

                                shifts.push({
                                    id: offerRequest.id,
                                    channelId: offerRequest.channel_id,
                                    requestId: offerRequest.request_id,
                                    user,
                                    type: "SWAP",
                                    shiftToOffer,
                                    shiftOfferedTo,
                                    requestNote: offerRequest.request_note,
                                    status: offerRequest.status,
                                    responseNote: offerRequest.responseNote,
                                    responseBy,
                                    responseAt: offerRequest.response_at,
                                    createdAt: offerRequest.created_at
                                });
                            }
                        }
                        checkComplete();
                    });
                } else {
                    checkComplete();
                }
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numRequests) {
                    resolve({ status: "success", message: "Fetch successful", numberOfRequests: shifts.length, result: shifts });
                }
            }
        });
    });
}


function getGraphQLAssignedShift(assignedShiftId) {
    return new Promise(resolve => {
        shiftQueries.getAssignedShifts([assignedShiftId], "id=$1", result => {
            if (result.err || result.res.length == 0) return resolve([]);
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
                    id: assignedShiftId,
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
const shiftQueries = require("../../postgres/shift-queries");
const { checkAuthorization } = require('./lib');

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
            if (result.err) return resolve(getGraphQLOutput("failed", result.err, null));

            let requests = result.res;
            const numRequests = requests.length;
            let cursor = -1;
            let shifts = [];

            requests.forEach(request => {
                if (request.type == "requestTimeoff") {
                    shiftQueries.getRequestTimeOff([channelId, request.id, formatDate(startDate), formatDate(endDate)], "channel_id=$1 AND request_id=$2 AND start_time >= $3 AND end_time <= $4", result => {
                        if (!result.err && result.res.length > 0) {
                            let timeOffRequests = result.res;
                            for (let timeOffRequest of timeOffRequests) {
                                shifts.push({
                                    id: timeOffRequest.id,
                                    type: "requestTimeOff",
                                    label: timeOffRequest.reason,
                                    note: timeOffRequest.note,
                                    color: color.gray,
                                    startTime: timeOffRequest.start_time,
                                    endTime: timeOffRequest.end_time,
                                    is24Hours: timeOffRequest.is_all_day
                                });
                            }
                        }
                        checkComplete();
                    });
                } else if (request.type == "requestSwap") {
                    shiftQueries.getRequestSwap([channelId, request.id, "pending"], "channel_id=$1 AND request_id=$2 AND status=$3", async result => {
                        if (!result.err && result.res.length > 0) {
                            let swapRequests = result.res;
                            for (let swapRequest of swapRequests) {
                                let shiftToSwap = await getGraphQLAssignedShift(swapRequest.assigned_user_shift_id);
                                let toSwapWith = await getGraphQLAssignedShift(swapRequest.assigned_user_shift_id_to_swap);
                                shifts.push({
                                    id: swapRequest.id,
                                    type: "requestSwap",
                                    color: color.gray,
                                    note: swapRequest.request_note,
                                    shiftToSwap,
                                    toSwapWith
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
                                let shiftToOffer = await getGraphQLAssignedShift(offerRequest.assigned_user_shift_id);
                                shifts.push({
                                    id: offerRequest.id,
                                    type: "requestOffer",
                                    color: color.gray,
                                    note: offerRequest.request_note,
                                    shiftToOffer
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
                    resolve(shifts);
                }
            }
        });
    });
}
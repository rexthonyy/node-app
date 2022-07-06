const { formatDate } = require("../../../libs/util");
const { unpaidBreakValue, colorValue, requestType, requestStatus } = require("../../../libs/consts");
const shiftQueries = require("../../../postgres/shift-queries");
const { checkAuthorization, userPermissionGroupHasAccess, getGraphQLUserById } = require('../lib');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message, null));

        let channelId = args.channelId;
        let isAllDay = args.isAllDay;
        let startTime = new Date(args.startTime);
        let endTime = new Date(args.endTime);
        let reason = args.reason;
        let note = args.note || "";

        resolve(await requestCreateTimeOff(authUser, channelId, isAllDay, startTime, endTime, reason, note));
    });
}

function getGraphQLOutput(status, message, result) {
    return {
        status,
        message,
        result
    };
}

function requestCreateTimeOff(authUser, channelId, isAllDay, startTime, endTime, reason, note) {
    return new Promise(resolve => {
        shiftQueries.createRequest([channelId, authUser.id, -1, requestType.requestTimeOff], result => {
            if (result.err) return resolve(getGraphQLOutput("failed", result.err, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("failed", "Request could not be created", null));
            let request = result.res[0];

            let values = [
                channelId,
                request.id,
                authUser.id,
                isAllDay,
                formatDate(startTime),
                formatDate(endTime),
                reason,
                note,
                requestStatus.pending,
                null,
                null,
                null
            ];

            shiftQueries.createRequestTimeOff(values, async result => {
                if (result.err) return resolve(getGraphQLOutput("failed", result.err, null));
                if (result.res.length == 0) return resolve(getGraphQLOutput("failed", "Request offer could not be created", null));
                let timeoff = await getRequestOffer(channelId, request.id);
                resolve(getGraphQLOutput("success", "Request offer created", timeoff));
            });
        });
    });
}

function getRequestOffer(channelId, requestId) {
    return new Promise(resolve => {
        shiftQueries.getRequestTimeOff([channelId, requestId], "channel_id=$1 AND request_id=$2", async result => {
            if (!result.err && result.res.length > 0) {
                let timeOffRequest = result.res[0];
                let user = await getGraphQLUserById(timeOffRequest.user_id);
                let responseBy = null;
                resolve({
                    id: timeOffRequest.id,
                    channelId: timeOffRequest.channel_id,
                    requestId: timeOffRequest.request_id,
                    user,
                    type: requestType.requestOffer,
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
            } else {
                resolve("failed to resolve request");
            }
        });
    });
}
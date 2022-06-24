const shiftQueries = require("../../postgres/shift-queries");
const { checkAuthorization, getGraphQLUserById } = require('./lib');
const { formatDate, sortByStartTime, diffHours, paginate } = require("../../libs/util");
const { color } = require("../../libs/consts");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message, null));

        let channelId = args.channelId;
        let shiftGroupId = args.shiftGroupId;
        let filter = args.filter ? args.filter : { includeShifts: true, includeOpenShifts: true, includeRequests: true };
        let page = args.page ? args.page : null;
        let limit = args.limit ? args.limit : null;
        let startDate = new Date(args.startDate);
        let endDate = new Date(args.endDate);

        resolve(await getShifts(authUser, channelId, shiftGroupId, filter, page, limit, startDate, endDate));
    });
}

function getGraphQLOutput(status, message, result, pageInfo = null) {
    return {
        status,
        message,
        pageInfo,
        result
    };
}

function getShifts(authUser, channelId, shiftGroupId, filter, page, limit, startDate, endDate) {
    return new Promise(async resolve => {
        let openShifts = result = null;
        let assignedShifts = [];

        if (filter.includeOpenShifts) {
            openShifts = await getOpenShifts(channelId, shiftGroupId, startDate, endDate);
        }

        if (filter.includeShifts) {
            assignedShifts = await getAssignedShifts(authUser, filter.includeRequests, channelId, shiftGroupId, startDate, endDate);
            result = paginate(page, limit, assignedShifts);
        }

        resolve(getGraphQLOutput("success", "Fetch successful", { openShifts, assignedShifts }, { next: result.next, previous: result.previous }));
    });
}

function getOpenShifts(channelId, shiftGroupId, startDate, endDate) {
    return new Promise(resolve => {
        shiftQueries.getOpenShifts([channelId, shiftGroupId, formatDate(startDate), formatDate(endDate)], "channel_id=$1 AND shift_group_id=$2 AND start_time >= $3 AND end_time <= $4", async result => {
            let title = "Open shifts";
            let numberOfShifts = 0;
            let shifts = [];
            if (!result.err && result.res.length > 0) {
                let openShifts = result.res;
                numberOfShifts = openShifts.length;
                let cursor = -1;

                openShifts.forEach(openShift => {
                    shiftQueries.getOpenShiftActivities([openShift.id], "open_shift_id=$1", result => {
                        let openShiftActivities = [];
                        if (!result.err && result.res.length > 0) {
                            let activities = result.res;
                            for (let activity of activities) {
                                openShiftActivities.push({
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

                        shifts.push({
                            id: openShift.id,
                            label: openShift.label,
                            note: openShift.note,
                            color: openShift.color,
                            startTime: openShift.start_time,
                            endTime: openShift.end_time,
                            break: openShift.unpaid_break_time,
                            is24Hours: openShift.is24Hours,
                            subshifts: openShiftActivities,
                            slots: openShift.slots
                        });

                        checkComplete();
                    });
                });

                checkComplete();

                function checkComplete() {
                    cursor++;
                    if (cursor == numberOfShifts) {
                        resolve({ title, numberOfShifts, shifts });
                    }
                }
            } else {
                resolve({ title, numberOfShifts, shifts });
            }
        });
    });
}

function getAssignedShifts(authUser, includeRequests, channelId, shiftGroupId, startDate, endDate) {
    return new Promise(resolve => {
        shiftQueries.getShiftGroupMembersByChannelIdAndShiftGroupId([channelId, shiftGroupId], result => {
            if (result.err) return resolve([]);
            let shiftGroupMembers = result.res;
            const numShiftGroupMembers = shiftGroupMembers.length;
            let cursor = -1;
            let assignedShifts = [];

            shiftGroupMembers.forEach(async groupMember => {
                let shifts = await getGroupMemberAssignedShifts(channelId, shiftGroupId, groupMember.user_id, startDate, endDate);
                let timeOffs = await getGroupMemberTimeoffs(channelId, shiftGroupId, groupMember.user_id, startDate, endDate);
                let requests = [];
                if (includeRequests) requests = await getGroupMemberRequests(authUser, channelId, shiftGroupId, groupMember.user_id, startDate, endDate);

                let groupMemberShifts = shifts.concat(timeOffs).concat(requests);
                groupMemberShifts.sort(sortByStartTime);

                let userId = groupMember.user_id;
                let graphQLUser = await getGraphQLUserById(userId);
                let name = `${graphQLUser.firstName} ${graphQLUser.lastName}`;
                let image = graphQLUser.avatar.url;
                let numberOfHours = 0;
                for (let shift of groupMemberShifts) {
                    numberOfHours += diffHours(new Date(shift.endTime), new Date(shift.startTime));
                }

                assignedShifts.push({ userId, name, image, numberOfHours, shifts: groupMemberShifts });
                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numShiftGroupMembers) {
                    resolve(assignedShifts);
                }
            }
        });
    });
}

function getGroupMemberAssignedShifts(channelId, shiftGroupId, userId, startDate, endDate) {
    return new Promise(resolve => {
        shiftQueries.getAssignedShifts([channelId, shiftGroupId, userId, formatDate(startDate), formatDate(endDate)], "channel_id=$1 AND shift_group_id=$2 AND user_id=$3 AND start_time >= $4 AND end_time <= $5", result => {
            if (result.err) return resolve([]);
            let assignedShifts = result.res;
            const numAssignedShifts = assignedShifts.length;
            let cursor = -1;
            let shifts = [];

            assignedShifts.forEach(assignedShift => {
                shiftQueries.getAssignedShiftActivities([channelId, shiftGroupId, assignedShift.id, userId], "channel_id=$1 AND shift_group_id=$2 AND assigned_shift_id=$3 AND user_id=$4", result => {
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

                    shifts.push({
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

                    checkComplete();
                });
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numAssignedShifts) {
                    resolve(shifts);
                }
            }
        });
    });
}


function getGraphQLAssignedShift(assignedShiftId) {
    return new Promise(resolve => {
        shiftQueries.getAssignedShifts([assignedShiftId], "id=$1", result => {
            if (result.err) return resolve([]);
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

function getGroupMemberTimeoffs(channelId, shiftGroupId, userId, startDate, endDate) {
    return new Promise(resolve => {
        shiftQueries.getUserTimeOffs([channelId, shiftGroupId, userId, formatDate(startDate), formatDate(endDate)], "channel_id=$1 AND shift_group_id=$2 AND user_id=$3 AND start_time >= $4 AND end_time <= $5", result => {
            if (result.err) return resolve([]);
            let timeOffs = result.res;
            let shifts = [];
            for (let timeOff of timeOffs) {
                shifts.push({
                    id: timeOff.id,
                    type: "timeoff",
                    label: timeOff.label,
                    note: timeOff.note,
                    color: timeOff.color,
                    startTime: timeOff.start_time,
                    endTime: timeOff.end_time,
                    is24Hours: timeOff.is24Hours
                });
            }

            resolve(shifts);
        });
    });
}

function getGroupMemberRequests(authUser, channelId, shiftGroupId, userId, startDate, endDate) {
    return new Promise(resolve => {
        shiftQueries.getRequests([channelId, userId], "channel_id=$1 AND (user_id=$2 OR receipient_id=$2)", result => {
            if (result.err) return resolve([]);
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
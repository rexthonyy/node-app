const shiftQueries = require("../../../postgres/shift-queries");
const { checkAuthorization, getGraphQLUserById } = require('../lib');
const { formatDate, sortByStartTime, diffHours, paginate } = require("../../../libs/util");
const { color } = require("../../../libs/consts");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message, null));

        try {
            let channelId = args.channelId;
            let filter = args.filter ? args.filter : { includeShifts: true, includeOpenShifts: true, includeRequests: true, shiftGroupIds: null };
            let startDate = new Date(args.startDate);
            let endDate = new Date(args.endDate);

            shiftQueries.getShiftGroup([channelId], "channel_id=$1", result => {
                if (result.err) return getGraphQLOutput("channelId", JSON.stringify(result.err), null);
                let groups = result.res;
                const numGroups = groups.length;
                let cursor = -1;
                let results = [];

                groups.forEach(async group => {
                    try {
                        let shifts = await getShiftsByPeople(authUser, channelId, group.id, filter, startDate, endDate);
                        results.push({
                            groupId: group.id,
                            groupName: group.name,
                            shifts
                        })
                    } catch (err) {}
                    checkComplete();
                });

                checkComplete();

                async function checkComplete() {
                    cursor++;
                    if (cursor == numGroups) {
                        if (filter.shiftGroupIds) {
                            let data = [];
                            for (let result of results) {
                                for (let shiftGroupId of filter.shiftGroupIds) {
                                    if (result.groupId == shiftGroupId) {
                                        data.push(result);
                                    }
                                }
                            }
                            if (filter.shiftGroupMemberIds) {
                                for (let data_ of data) {
                                    let assignedShifts = [];
                                    for (let assignedShift of data_.shifts.assignedShifts) {
                                        for (let memberId of filter.shiftGroupMemberIds) {
                                            if (assignedShift.userId == memberId) {
                                                assignedShifts.push(assignedShift);
                                            }
                                        }
                                    }
                                    data_.shifts.assignedShifts = assignedShifts;
                                }
                            }
                            return resolve(getGraphQLOutput("success", "Fetch successful", data))
                        }
                        resolve(getGraphQLOutput("success", "Fetch successful", results))
                    }
                }
            });
        } catch (err) {
            reject(err);
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

function getShifts(shiftsResponse) {
    return new Promise(async resolve => {

        let assignedShifts = shiftsResponse.assignedShifts;
        let userShifts = [];

        for (let assignedShift of assignedShifts) {
            for (let shift of assignedShift.shifts) {
                if (shift.type == "shift") {
                    userShifts.push({
                        label: shift.label,
                        break: shift.break,
                        color: shift.color,
                        startTime: shift.startTime,
                        endTime: shift.endTime,
                        is24Hours: shift.is24Hours,
                        users: [assignedShift.userId]
                    });
                }
            }
        }


        let taskShiftsGroupByLabel = {};

        for (let userShift of userShifts) {
            if (taskShiftsGroupByLabel[userShift.label]) {
                taskShiftsGroupByLabel[userShift.label].push(userShift);
            } else {
                taskShiftsGroupByLabel[userShift.label] = [];
                taskShiftsGroupByLabel[userShift.label].push(userShift);
            }
        }

        let taskShifts = [];

        for (const [key, labelGroup] of Object.entries(taskShiftsGroupByLabel)) {
            let taskShiftsGroupsByTime = {};
            for (let g of labelGroup) {
                if (taskShiftsGroupsByTime[(g.startTime + g.endTime)]) {
                    taskShiftsGroupsByTime[(g.startTime + g.endTime)].push(g);
                } else {
                    taskShiftsGroupsByTime[(g.startTime + g.endTime)] = [];
                    taskShiftsGroupsByTime[(g.startTime + g.endTime)].push(g);
                }
            }

            for (const [key, timeGroup] of Object.entries(taskShiftsGroupsByTime)) {
                let taskShiftsGroupsByBreak = {};
                for (let g of timeGroup) {
                    if (taskShiftsGroupsByBreak[g.break]) {
                        taskShiftsGroupsByBreak[g.break].push(g);
                    } else {
                        taskShiftsGroupsByBreak[g.break] = [];
                        taskShiftsGroupsByBreak[g.break].push(g);
                    }
                }

                for (const [key, breakGroup] of Object.entries(taskShiftsGroupsByBreak)) {
                    let taskShiftsGroupsByColor = {};
                    for (let g of breakGroup) {
                        if (taskShiftsGroupsByColor[g.color]) {
                            taskShiftsGroupsByColor[g.color].push(g);
                        } else {
                            taskShiftsGroupsByColor[g.color] = [];
                            taskShiftsGroupsByColor[g.color].push(g);
                        }
                    }

                    for (const [key, colorGroup] of Object.entries(taskShiftsGroupsByColor)) {
                        let taskShiftsGroupsByUser = {};
                        for (let g of breakGroup) {
                            if (taskShiftsGroupsByUser[g.users[0]]) {
                                taskShiftsGroupsByUser[g.users[0]].push(g);
                            } else {
                                taskShiftsGroupsByUser[g.users[0]] = [];
                                taskShiftsGroupsByUser[g.users[0]].push(g);
                            }
                        }

                        for (const [key, userGroup] of Object.entries(taskShiftsGroupsByColor)) {
                            let users = [];
                            for (let g of userGroup) {
                                users.push(await getGraphQLUserById(g.users[0]))
                            }
                            taskShifts.push({
                                label: labelGroup[0].label,
                                break: breakGroup[0].break,
                                color: colorGroup[0].color,
                                startTime: timeGroup[0].startTime,
                                endTime: timeGroup[0].endTime,
                                is24Hours: timeGroup[0].is24Hours,
                                users
                            });
                        }
                    }
                }
            }
        }

        resolve(taskShifts);
    });
}


function getShiftsByPeople(authUser, channelId, shiftGroupId, filter, startDate, endDate) {
    return new Promise(async resolve => {
        let openShifts = null;
        let assignedShifts = [];

        if (filter.includeOpenShifts) {
            openShifts = await getOpenShifts(channelId, shiftGroupId, startDate, endDate);
        }

        if (filter.includeShifts) {
            try {
                assignedShifts = await getAssignedShifts(authUser, filter.includeRequests, channelId, shiftGroupId, startDate, endDate);
            } catch (err) {
                assignedShifts = [];
            }
        }

        resolve({ openShifts, assignedShifts });
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
                                    startTime: formatDate(activity.start_time),
                                    endTime: formatDate(activity.end_time),
                                    isPaid: activity.is_paid
                                });
                            }
                        }

                        shifts.push({
                            id: openShift.id,
                            label: openShift.label,
                            note: openShift.note,
                            color: openShift.color,
                            startTime: formatDate(openShift.start_time),
                            endTime: formatDate(openShift.end_time),
                            break: openShift.unpaid_break_time,
                            is24Hours: openShift.is24hours,
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
                                startTime: formatDate(activity.start_time),
                                endTime: formatDate(activity.end_time),
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
                        startTime: formatDate(assignedShift.start_time),
                        endTime: formatDate(assignedShift.end_time),
                        break: assignedShift.unpaid_break_time,
                        is24Hours: assignedShift.is24hours,
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
                            startTime: formatDate(activity.start_time),
                            endTime: formatDate(activity.end_time),
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
                    startTime: formatDate(assignedShift.start_time),
                    endTime: formatDate(assignedShift.end_time),
                    break: assignedShift.unpaid_break_time,
                    is24Hours: assignedShift.is24hours,
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
                    startTime: formatDate(timeOff.start_time),
                    endTime: formatDate(timeOff.end_time),
                    is24Hours: timeOff.is24hours
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
                                    startTime: formatDate(timeOffRequest.start_time),
                                    endTime: formatDate(timeOffRequest.end_time),
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
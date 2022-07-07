const shiftQueries = require("../../../postgres/shift-queries");
const { checkAuthorization, getGraphQLUserById } = require('../lib');
const { formatDate, sortByStartTime, diffHours } = require("../../../libs/util");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return reject(message);

        try {
            resolve(await getSharedSchedules(args));
        } catch (err) {
            reject(err);
        }
    });
}

function getSharedSchedules(args) {
    return new Promise(async(resolve, reject) => {
        try {
            let edges = await getAllSharedSchedules(args);
            if (args.first) {
                edges = edges.splice(0, args.first);
            }
            resolve({
                pageInfo: {
                    hasNextPage: false,
                    hasPreviousPage: false,
                    startCursor: "",
                    endCursor: ""
                },
                edges,
                totalCount: edges.length
            });
        } catch (err) {
            reject(err);
        }
    });
}

function getGraphQLOutput(status, message, schedules) {
    return {
        status,
        message,
        schedules
    };
}

function getAllSharedSchedules({ channel, shiftGroupId, startDate, endDate }) {
    return new Promise(async(resolve, reject) => {
        startDate = new Date(startDate);
        endDate = new Date(endDate);
        kratosQueries.getChannel([channel], "slug=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Channel not found");
            let channelId = result.res[0].id;
            shiftQueries.getShiftGroupMembersByChannelIdAndShiftGroupId([channelId, shiftGroupId], result => {
                if (result.err) return reject(JSON.stringify(result.err));
                let shiftGroupMembers = result.res;
                const numShiftGroupMembers = shiftGroupMembers.length;
                let cursor = -1;
                let assignedShifts = [];

                shiftGroupMembers.forEach(async groupMember => {
                    let shifts = await getGroupMemberSharedSchedules(channelId, shiftGroupId, groupMember.user_id, startDate, endDate);
                    shifts.sort(sortByStartTime);

                    let userId = groupMember.user_id;
                    let graphQLUser = await getGraphQLUserById(userId);
                    let name = `${graphQLUser.firstName} ${graphQLUser.lastName}`;
                    let image = graphQLUser.avatar.url;
                    let numberOfHours = 0;
                    for (let shift of shifts) {
                        numberOfHours += diffHours(new Date(shift.endTime), new Date(shift.startTime));
                    }

                    assignedShifts.push({ userId, name, image, numberOfHours, shifts });
                    checkComplete();
                });

                checkComplete();

                function checkComplete() {
                    cursor++;
                    if (cursor == numShiftGroupMembers) {
                        let edges = [];
                        for (let assignedShift of assignedShifts) {
                            edges.push({
                                cursor: "",
                                node: assignedShift
                            });
                        }
                        resolve(edges);
                    }
                }
            });
        });
    });
}

function getGroupMemberSharedSchedules(channelId, shiftGroupId, userId, startDate, endDate) {
    return new Promise(resolve => {
        shiftQueries.getSharedSchedules([channelId, shiftGroupId, userId, formatDate(startDate), formatDate(endDate)], "channel_id=$1 AND shift_group_id=$2 AND user_id=$3 AND start_time >= $4 AND end_time <= $5", result => {
            if (result.err) return resolve([]);
            let scheduleRows = result.res;
            let schedules = [];

            for (let schedule of scheduleRows) {
                schedules.push({
                    id: schedule.id,
                    type: "shift",
                    label: schedule.label,
                    note: schedule.note,
                    color: schedule.color,
                    startTime: schedule.start_time,
                    endTime: schedule.end_time,
                    break: schedule.unpaid_break_time,
                    is24Hours: schedule.is24Hours
                });
            }

            resolve(schedules);
        });
    });
}
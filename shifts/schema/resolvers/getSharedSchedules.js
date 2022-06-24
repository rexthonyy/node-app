const shiftQueries = require("../../postgres/shift-queries");
const { checkAuthorization, getGraphQLUserById } = require('./lib');
const { formatDate, sortByStartTime, diffHours, paginate } = require("../../libs/util");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message, null));

        let channelId = args.channelId;
        let shiftGroupId = args.shiftGroupId;
        let startDate = new Date(args.startDate);
        let endDate = new Date(args.endDate);

        resolve(await getSharedSchedules(authUser, channelId, shiftGroupId, startDate, endDate));
    });
}

function getGraphQLOutput(status, message, result) {
    return {
        status,
        message,
        schedules
    };
}

function getSharedSchedules(authUser, channelId, shiftGroupId, startDate, endDate) {
    return new Promise(async resolve => {
        shiftQueries.getShiftGroupMembersByChannelIdAndShiftGroupId([channelId, shiftGroupId], result => {
            if (result.err) return resolve([]);
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
                    resolve(getGraphQLOutput("success", "Fetch successful", assignedShifts));
                }
            }
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
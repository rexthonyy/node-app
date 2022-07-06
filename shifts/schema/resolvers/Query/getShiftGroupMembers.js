const shiftQueries = require("../../../postgres/shift-queries");
const { checkAuthorization, getGraphQLUserById } = require('../lib');
const { sortByPosition } = require("../../../libs/util");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message, null));

        let channelId = args.channelId;
        let shiftGroupId = args.shiftGroupId;

        resolve(await getShiftGroupMembers(channelId, shiftGroupId));
    });
}

function getGraphQLOutput(status, message, result) {
    return {
        status,
        message,
        result
    };
}

function getShiftGroupMembers(channelId, shiftGroupId) {
    return new Promise(resolve => {
        shiftQueries.getShiftGroupMembersByChannelIdAndShiftGroupId([channelId, shiftGroupId], async result => {
            if (result.err) return resolve(getGraphQLOutput("graphql error", "Failed to get shift group members", null));
            let shiftGroupMembers = result.res;
            shiftGroupMembers.sort(sortByPosition);
            let data = [];
            for (let groupMember of shiftGroupMembers) {
                data.push(await getGraphQLUserById(groupMember.user_id));
            }
            resolve(getGraphQLOutput("success", `${data.length} shift group members`, data));
        });
    });
}
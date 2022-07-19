const shiftQueries = require("../../../postgres/shift-queries");
const { checkAuthorization, getGraphQLUserById } = require('../lib');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message, null));

        let channelId = args.channelId;
        let shiftGroupId = args.shiftGroupId;

        resolve(await getNonShiftGroupMembers(channelId, shiftGroupId));
    });
}

function getGraphQLOutput(status, message, result) {
    return {
        status,
        message,
        result
    };
}

function getNonShiftGroupMembers(channelId, shiftGroupId) {
    return new Promise(resolve => {
        shiftQueries.getShiftGroupMembersByChannelId([channelId], result => {
            if (result.err) return resolve(getGraphQLOutput("graphql error", "Failed to get shift group members", null));
            let channelGroupMembers = result.res;
            shiftQueries.getShiftGroupMembersByChannelIdAndShiftGroupId([channelId, shiftGroupId], async result => {
                if (result.err) return resolve(getGraphQLOutput("graphql error", "Failed to get shift group members", null));
                let shiftGroupMembers = result.res;
                let data = [];

                for (let channelGroupMember of channelGroupMembers) {
                    let isFound = false;
                    for (let shiftGroupMember of shiftGroupMembers) {
                        if (channelGroupMember.user_id == shiftGroupMember.user_id) {
                            isFound = true;
                            break;
                        }
                    }
                    if (!isFound) {
                        data.push(await getGraphQLUserById(channelGroupMember.user_id));
                    }
                }
                resolve(getGraphQLOutput("success", `${data.length} non shift group members`, data));
            });
        });
    });
}
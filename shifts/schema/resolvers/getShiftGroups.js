const shiftQueries = require("../../postgres/shift-queries");
const { checkAuthorization } = require('./lib');
const { sortByPosition } = require("../../libs/util");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message, null));

        let channelId = args.channelId;
        let page = args.page ? args.page : null;
        let limit = args.limit ? args.limit : null;

        resolve(await getShiftGroups(channelId, page, limit));
    });
}

function getGraphQLOutput(status, message, result, pageInfo) {
    return {
        status,
        message,
        pageInfo,
        result
    };
}

function getShiftGroups(channelId, page, limit) {
    return new Promise(resolve => {
        shiftQueries.getShiftGroupsByChannelId([channelId], result => {
            if (result.err) return resolve(getGraphQLOutput("graphql error", "Failed to get shift groups", null));
            let shiftGroups = result.res;
            shiftGroups.sort(sortByPosition);
            let data = [];
            for (let shiftGroup of shiftGroups) {
                data.push({
                    channelId: shiftGroup.channel_id,
                    shiftGroupId: shiftGroup.id,
                    name: shiftGroup.name
                });
            }

            let pageInfo = paginate(page, limit, data);

            resolve(getGraphQLOutput("success", `${data.length} shift groups`, data, { next: pageInfo.next, previous: pageInfo.previous, totalPages: pageInfo.totalPages }));
        });
    });
}
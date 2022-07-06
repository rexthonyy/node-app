const kratosQueries = require("../../../postgres/kratos-queries");
const shiftQueries = require("../../../postgres/shift-queries");
const { checkAuthorization } = require('../lib');
const { sortByPosition, paginate } = require("../../../libs/util");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message, null));

        let channel = args.channel;

        resolve(await getShiftGroups(channel));
    });
}

function getGraphQLOutput(status, message, result, pageInfo) {
    if (!pageInfo.next) delete pageInfo.next;
    if (!pageInfo.previous) delete pageInfo.previous;
    return {
        status,
        message,
        pageInfo,
        result
    };
}

function getShiftGroups(channel) {
    return new Promise(async(resolve, reject) => {
        try {
            let edges = await getAllShiftGroups(channel);
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

function getAllShiftGroups(channel) {
    return new Promise(resolve => {
        kratosQueries.getChannel([channel], "slug=$1", result => {
            if (result.err) return resolve(getGraphQLOutput("graphql error", JSON.stringify(result.err), null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("failed", "Channel not found", null));
            let channelId = result.res[0].id;
            shiftQueries.getShiftGroups([channelId], result => {
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
                resolve(data);
            });
        });
    });
}
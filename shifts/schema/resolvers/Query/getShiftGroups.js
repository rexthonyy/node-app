const kratosQueries = require("../../../postgres/kratos-queries");
const shiftQueries = require("../../../postgres/shift-queries");
const { checkAuthorization } = require('../lib');
const { sortByPosition } = require("../../../libs/util");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return reject(message);
        try {
            resolve(await getShiftGroups(args));
        } catch (err) {
            reject(err);
        }
    });
}

function getShiftGroups(args) {
    return new Promise(async(resolve, reject) => {
        try {
            let edges = await getAllShiftGroups(args.channel);
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

function getAllShiftGroups(channel) {
    return new Promise((resolve, reject) => {
        kratosQueries.getChannel([channel], "slug=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Channel not found");
            let channelId = result.res[0].id;
            shiftQueries.getShiftGroupsByChannelId([channelId], result => {
                if (result.err) return reject("Failed to get shift groups");
                let shiftGroups = result.res;
                shiftGroups.sort(sortByPosition);
                let edges = [];
                for (let shiftGroup of shiftGroups) {
                    edges.push({
                        cursor: "",
                        node: {
                            channelId: shiftGroup.channel_id,
                            shiftGroupId: shiftGroup.id,
                            name: shiftGroup.name
                        }
                    });
                }
                resolve(edges);
            });
        });
    });
}
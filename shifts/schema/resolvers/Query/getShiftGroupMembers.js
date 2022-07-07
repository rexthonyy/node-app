const kratosQueries = require("../../../postgres/kratos-queries");
const shiftQueries = require("../../../postgres/shift-queries");
const { checkAuthorization, getGraphQLUserById } = require('../lib');
const { sortByPosition } = require("../../../libs/util");

module.exports = async(parent, args, context) => {
    return new Promise(async (resolve, reject) => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return reject(message);

        try{
            resolve(await getShiftGroupMembers(args));
        }catch(err){
            reject(err);
        }
    });
}

function getShiftGroupMembers(args) {
    return new Promise(async(resolve, reject) => {
        try {
            let edges = await getAllShiftGroupMembers(args);
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

function getShiftGroupMembers({channel, shiftGroupId}) {
    return new Promise((resolve, reject) => {
        kratosQueries.getChannel([channel], "slug=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Channel not found");
            let channelId = result.res[0].id;
            shiftQueries.getShiftGroupMembersByChannelIdAndShiftGroupId([channelId, shiftGroupId], async result => {
                if (result.err) return reject("Failed to get shift group members");
                let shiftGroupMembers = result.res;
                shiftGroupMembers.sort(sortByPosition);
                let edges = [];
                for (let groupMember of shiftGroupMembers) {
                    edges.push({
                        cursor: "",
                        node: await getGraphQLUserById(groupMember.user_id)
                    });
                }
                resolve(edges);
            });
        });
    });
}
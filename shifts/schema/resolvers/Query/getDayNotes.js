const { formatDate } = require("../../../libs/util");
const shiftQueries = require("../../../postgres/shift-queries");
const { checkAuthorization, userPermissionGroupHasAccess } = require('../lib');

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return reject(message);

        if (authUser.userPermissions.find(permission => permission.code == "MANAGE_STAFF")) {
            try {
                resolve(await getDailyNotes(args));
            } catch (err) {
                reject(err);
            }
        } else if (userPermissionGroupHasAccess(authUser.permissionGroups, ["MANAGE_STAFF"])) {
            try {
                resolve(await getDailyNotes(args));
            } catch (err) {
                reject(err);
            }
        } else {
            reject("You do not have permission to perform this operation");
        }
    });
}

function getDailyNotes(args) {
    return new Promise(async(resolve, reject) => {
        try {
            let edges = await getAllDailyNotes(args);
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

function getAllDailyNotes({ channel, startTime, endTime }) {
    return new Promise(async(resolve, reject) => {
        let startDate = new Date(startTime);
        let endDate = new Date(endTime);
        kratosQueries.getChannel([channel], "slug=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Channel not found");
            let channelId = result.res[0].id;
            shiftQueries.getDayNotes([channelId, formatDate(startDate), formatDate(endDate)], "channel_id=$1 AND date >= $2 AND date <= $3", result => {
                if (result.err) return reject(JSON.stringify(result.err));
                let notes = result.res;
                const numNotes = notes.length;
                notes.forEach(note => note.numberOfNotes = numNotes);
                let edges = [];
                for (let note of notes) {
                    edges.push({
                        cursor: "",
                        node: note
                    });
                }
                resolve(edges);
            });
        });
    });
}
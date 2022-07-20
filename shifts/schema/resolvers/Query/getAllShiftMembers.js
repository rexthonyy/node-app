const kratosQueries = require("../../../postgres/kratos-queries");
const shiftQueries = require("../../../postgres/shift-queries");
const { checkAuthorization, getGraphQLUserById } = require('../lib');
const { sortByPosition } = require("../../../libs/util");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return reject(message);

        try {
            resolve(await getAllShiftMembers(args));
        } catch (err) {
            reject(err);
        }
    });
}

function getAllShiftMembers(args) {
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

function getAllShiftGroupMembers({ channel, shiftGroupId }) {
    return new Promise((resolve, reject) => {
        kratosQueries.getUserByIsStaff([true], result => {
            if (result.err) return reject("Failed to get shift group members");
            let shiftGroupMembers = result.res;
            let edges = [];
            for (let groupMember of shiftGroupMembers) {
                edges.push({
                    cursor: "",
                    node: await getGraphQLUserById(groupMember.id)
                });
            }
            resolve(edges);
        });
    });
}
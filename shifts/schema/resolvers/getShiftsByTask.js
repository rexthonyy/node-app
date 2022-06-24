const shiftQueries = require("../../postgres/shift-queries");
const { checkAuthorization, getGraphQLUserById } = require('./lib');
const { formatDate, sortByStartTime, diffHours, paginate } = require("../../libs/util");
const { color } = require("../../libs/consts");
const getShiftsByPeople = require("./getShiftsByPeople");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message, null));

        try {
            let shiftsByPeople = await getShiftsByPeople(parent, args, context);
            resolve(getShifts(shiftsByPeople));
        } catch (err) {
            reject(err);
        }
    });
}

function getGraphQLOutput(status, message, result) {
    return {
        status,
        message,
        result
    };
}

function getShifts(shifts) {
    return new Promise(async resolve => {
        console.log(shifts);
        resolve(shifts);
    });
}
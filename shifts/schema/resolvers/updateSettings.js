const { formatDate, getDayFromDate } = require("../../libs/util");
const shiftQueries = require("../../postgres/shift-queries");
const { checkAuthorization, userPermissionGroupHasAccess, getGraphQLUserById } = require('./lib');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message, null));

        let key = args.key;
        let value = args.value;

        resolve(await updateSetting(key, value));
    });
}

function getGraphQLOutput(status, message, result) {
    return {
        status,
        message,
        result
    };
}

function updateSetting(key, value) {
    return new Promise(async resolve => {
        try {
            let settings = await getAllSettings();
            let isFound = false;
            for (let s of settings) {
                if (s.key == key) isFound = true;
            }
            if (!isFound) return resolve(getGraphQLOutput("failed", "Setting not found", null));
            shiftQueries.updateSetting([key, value], "value=$2", "key=$1", async result => {
                if (result.err) return resolve(getGraphQLOutput("failed", result.err, null));
                let updatedSettings = await getAllSettings();
                let settingsRes = {};
                for (let s of updatedSettings) {
                    settingsRes[s.key] = s.value;
                }
                return resolve(getGraphQLOutput("success", "Settings update successful", settingsRes));
            });
        } catch (err) {
            return resolve(err);
        }
    });
}

function getAllSettings() {
    return new Promise((resolve, reject) => {
        shiftQueries.getAllSettings(result => {
            if (result.err) return reject(getGraphQLOutput("failed", result.err, null));
            if (result.res.length == 0) return reject(getGraphQLOutput("failed", "Settings unintialized", null));
            resolve(result.res);
        });
    });
}
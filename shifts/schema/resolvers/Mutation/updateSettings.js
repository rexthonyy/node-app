const { settingsType } = require("../../../libs/consts");
const shiftQueries = require("../../../postgres/shift-queries");
const { checkAuthorization } = require('../lib');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message, null));
        let input = JSON.parse(args.input);
        if (input["key"] == undefined || input["value"] == undefined) return resolve(getGraphQLOutput("failed", "Please enter the key and value parameter of the settings", null));
        let key = input.key;
        let value = input.value;

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
    return new Promise(resolve => {
        try {
            if (settingsType[key] == undefined) return reject(getGraphQLOutput("failed", "Settings not defined", null));
            shiftQueries.updateSetting([key, { value }], "value=$2", "key=$1", async result => {
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
const shiftQueries = require("../../postgres/shift-queries");
const { checkAuthorization } = require('./lib');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message, null));

        resolve(await getSettings());
    });
}

function getGraphQLOutput(status, message, result) {
    return {
        status,
        message,
        result
    };
}

function getSettings() {
    return new Promise(resolve => {
        shiftQueries.getAllSettings(result => {
            if (result.err) return resolve(getGraphQLOutput("failed", result.err, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("failed", "Settings unintialized", null));
            let settings = result.res;
            let settingsRes = {};
            for (let s of settings) {
                settingsRes[s.key] = s.value;
            }
            if (result.res.length == 0) return resolve(getGraphQLOutput("success", "Settings fetch successful", settingsRes));
        });
    });
}
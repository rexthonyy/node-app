const kratosQueries = require("./kratos-queries");
const permissionsdbQueries = require("./permissionsdb-queries");
const shiftQueries = require("./shift-queries");

module.exports = {
    stop: () => {
        return new Promise(async resolve => {
            await kratosQueries.stop();
            await permissionsdbQueries.stop();
            await shiftQueries.stop();
            resolve();
        });
    }
}
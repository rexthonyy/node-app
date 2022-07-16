const kratosQueries = require("./kratos-queries");
const permissionsdbQueries = require("./permissionsdb-queries");

module.exports = {
    stop: () => {
        return new Promise(async resolve => {
            await kratosQueries.stop();
            await permissionsdbQueries.stop();
            resolve();
        });
    }
}
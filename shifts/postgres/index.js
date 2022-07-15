const kratosQueries = require("./kratos-queries");
const permissionsdbQueries = require("./permissionsdb-queries");
const shiftQueries = require("./shift-queries");

module.exports = {
    stop: () => {
        kratosQueries.stop();
        permissionsdbQueries.stop();
        shiftQueries.stop();
    }
}
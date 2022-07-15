const kratosQueries = require("./kratos-queries");
const permissionsdbQueries = require("./permissionsdb-queries");
const productQueries = require("./product-queries");
const shiftQueries = require("./shift-queries");

module.exports = {
    stop: () => {
        return new Promise(async resolve => {
            await kratosQueries.stop();
            await permissionsdbQueries.stop();
            await productQueries.stop();
            await shiftQueries.stop();
            resolve();
        });
    }
}
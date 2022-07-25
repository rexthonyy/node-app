const kratosQueries = require("./kratos-queries");
const productQueries = require("./product-queries");
const permissionsdbQueries = require("./permissionsdb-queries");

module.exports = {
    stop: () => {
        return new Promise(async resolve => {
            await kratosQueries.stop();
            await productQueries.stop();
            await permissionsdbQueries.stop();
            resolve();
        });
    }
}
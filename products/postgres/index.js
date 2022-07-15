const kratosQueries = require("./kratos-queries");
const permissionsdbQueries = require("./permissionsdb-queries");
const productQueries = require("./product-queries");
const shiftQueries = require("./shift-queries");

module.exports = {
    stop: () => {
        kratosQueries.stop();
        permissionsdbQueries.stop();
        productQueries.stop();
        shiftQueries.stop();
    }
}
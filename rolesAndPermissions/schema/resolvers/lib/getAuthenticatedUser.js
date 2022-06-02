const pgKratosQueries = require('../../../postgres/kratos-queries');

let getAuthenticatedUser = (context, cb) => {
    console.log(context);
    cb(null);
}

module.exports = getAuthenticatedUser;
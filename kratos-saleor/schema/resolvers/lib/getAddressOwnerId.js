const pgKratosQueries = require("../../postgres/kratos-queries");

const getAddressOwnerId = id => {
    return new Promise(resolve => {
        pgKratosQueries.getAccountUserAddressesByAddressId([id], result => {
            if (result.err || result.res.length == 0) return resolve(-1);
            resolve(result.res[0].user_id);
        });
    });
};

module.exports = getAddressOwnerId;
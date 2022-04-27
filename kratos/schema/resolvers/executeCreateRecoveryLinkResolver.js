const pgKratosQueries = require('../../postgres/kratos-queries');

const getData = ({createRecoveryLinkInput}) => {
    return new Promise((resolve, reject) => {
        resolve({
            expiresAt: "202232",
            recoveryLink: "api",
        });
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}
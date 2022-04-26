const pgKratosQueries = require('../../postgres/kratos-queries');

const getData = ({authorization, cookie}) => {
    return new Promise((resolve, reject) => {
        resolve({
            active: "active",
            authenticatedAt: "2022-01",
            expiresAt: "2022-01",
            id: 1,
            identity: "32453",
            issuedAt: "2022-02"
        });
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}
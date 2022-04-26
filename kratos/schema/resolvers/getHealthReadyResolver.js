const pgKratosQueries = require('../../postgres/kratos-queries');

const getData = () => {
    return new Promise((resolve, reject) => {
        resolve({
            status: "ok"
        });
    });
}

module.exports = async () => {
    return getData();
}
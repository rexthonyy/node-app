const pgKratosQueries = require('../../postgres/kratos-queries');

const getData = () => {
    return new Promise((resolve, reject) => {
        resolve({
            version: "1.0"
        });
    });
}

module.exports = async () => {
    return getData();
}
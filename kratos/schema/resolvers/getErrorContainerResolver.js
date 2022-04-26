const pgKratosQueries = require('../../postgres/kratos-queries');

const getData = ({error}) => {
    return new Promise((resolve, reject) => {
        resolve({
            errors: JSON.stringify({
                "code": 500,
                "message": error,
                "reason": "some reason",
                "debug": "some debug info"
            }),
            id: "9f900efa-a5ea-4dfd-8311-a8c7448ffeec"
        });
    });
}

module.exports = async (parent, args) => {
    return await getData(args);
}
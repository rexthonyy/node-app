const pgKratosQueries = require('../../postgres/kratos-queries');

const getData = () => {
    return new Promise((resolve, reject) => {
        pgKratosQueries.getNetworks(result => {
            if(result.err){
                reject({
                    status: "error",
                    reason: result.err
                });
            }else{
                resolve({
                    status: "ok"
                });
            }
        });
    });
}

module.exports = async () => {
    return getData();
}
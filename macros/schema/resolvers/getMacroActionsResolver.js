const pgQueries = require('../../postgres/macro-queries');

const getData = () => {
    return new Promise((resolve, reject) => {
        pgQueries.getMacroActions(result => {
            if(result.err){
                return reject(result.err);
            }

            resolve(result.res);
        });
    });
}

module.exports = async (parent, args) => {
    return await getData();
}
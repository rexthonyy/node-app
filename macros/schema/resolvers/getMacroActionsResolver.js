const pgQueries = require('../../postgres/macro-queries');

const getData = () => {
    return new Promise((resolve, reject) => {
        pgQueries.getMacroActions(result => {
            if(result.err){
                return reject(result.err);
            }

            let macro_actions = result.res;

            resolve(macro_actions);
        });
    });
}

module.exports = async (parent, args) => {
    let result = await getData();
    return result;
}
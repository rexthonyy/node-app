const pgKratosQueries = require('../../postgres/kratos-queries');

const getData = ({error}) => {
    return new Promise((resolve, reject) => {
        pgKratosQueries.getSelfServiceErrorById([error], result=> {
            if(result.err){
                return reject("Error not found");
            }

            let err = result.res;

            let errors = [];
            err.forEach(er => {
                errors.push(er.errors);
            })

            resolve({
                errors,
                id: error
            });
        });
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}
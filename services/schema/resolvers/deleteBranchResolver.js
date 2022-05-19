const pgQueries = require('../../postgres/servicesdb-queries');

const getData = (arg) => {
    return new Promise((resolve, reject) => {
        pgQueries.deleteBranchTranslationByBranchId([arg.branch_id], result => {
            if(result.err){
                console.error(result.err);
                reject("Failed to delete branch translations");
            }
            pgQueries.deleteBranchById([arg.branch_id], result1 => {
                if(result1.err){
                    console.error(result1.err);
                    reject("Failed to delete branch");
                }

                return resolve({
                    status: "success",
                    message: "Branch deleted successfully"
                });
            });
        });
    });
}

module.exports = async (parents, args) => {
    return getData(args);
}
const pgQueries = require('../../postgres/servicesdb-queries');
const consts = require('../../consts');

const getData = (arg) => {
    return new Promise((resolve, reject) => {
        let values = [
            args.branch_id,
            arg.locale_id,
            arg.name,
            arg.address,
            arg.location,
            arg.ref,
            consts.STATUS_COLOR.published
        ];

        pgQueries.updateBranchTranslation(values, result => {
            if(result.err){
                console.error(result.err);
                reject("Failed to update branch");
            }
            
            return resolve({
                status: "success",
                message: "Branch updated successfully"
            });
        });
    });
}

module.exports = async (parents, args) => {
    return getData(args);
}
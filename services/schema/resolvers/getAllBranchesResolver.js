const pgQueries = require('../../postgres/servicesdb-queries');

const getData = ({locale_id}) => {
    return new Promise((resolve, reject) => {
        
        pgQueries.getAllBranches(result1 => {
            if(result1.err){
                return reject(result1.err);
            }
            
            let branches = result1.res;
            let num_branches = branches.length;
            let count = -1;

            let branchTranslationTypeList = [];

            branches.forEach(branch => {
                pgQueries.getAllBranchTranslationsByBranchIdAndLocaleId([branch.id, locale_id], result => {
                    if(result.err){
                        console.error(result.err);
                    }else if(result.res.length > 0){
                        branchTranslationTypeList.push(result.res[0]);
                    }
                    checkComplete();
                });
            });

            checkComplete();

            function checkComplete(){
                count++;
                if(count == num_branches){
                    return resolve(branchTranslationTypeList);
                }
            }
        });
    });
}

module.exports = async (parents, args) => {
    return getData(args);
}
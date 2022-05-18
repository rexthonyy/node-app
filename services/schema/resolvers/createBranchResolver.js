const pgQueries = require('../../postgres/servicesdb-queries');
const pgSettingsQueries = require('../../postgres/settings-queries');

const getData = (arg) => {
    return new Promise((resolve, reject) => {
        
        pgSettingsQueries.getPageTranslations(result => {
            if(result.err){
                return reject(result.err);
            }

            let translations = result.res;
            if(translations.length == 0){
                return reject("Please specify at least one page translation");
            }

            let num_translations = translations.length;
            let count = -1;

            translations.forEach(translation => {
                pgQueries.createBranch(result => {
                    if(result.err){
                        console.error(result.err);
                        checkComplete();
                    }else{
                        let branch = result.res;

                        let values = [
                            branch.id,
                            arg.locale_id,
                            arg.name,
                            arg.address,
                            arg.location,
                            arg.ref,
                            
                        ];
                    }
                });

            });

            checkComplete();

            function checkComplete(){
                count++;
                if(count == num_translations){
                    return resolve({
                        status: "success",
                        message: "New branch created successfully"
                    });
                }
            }
        });

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
                    if(result.err || result.res.length == 0){
                        checkComplete();
                    }else{
                        branchTranslationTypeList.push(result.res[0]);
                    }
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
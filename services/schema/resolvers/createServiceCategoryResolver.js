const pgSettingsQueries = require('../../postgres/settings-queries');
const pgQueries = require('../../postgres/servicesdb-queries');
const consts = require('../../consts');

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

            let isFound = false;

            for(const element of translations){
                if(arg.locale_id == element.id){
                    isFound = true;
                }
            }

            if(!isFound) return reject("Invalid translation. Enter a valid locale_id");

            pgQueries.getBranchById([arg.branch_id], result => {
                if(result.err){
                    return reject(result.err);
                }

                if(result.res.length == 0) return reject("Branch not found");

                pgQueries.createServiceCategory([arg.branch_id], result => {
                    if(result.err){
                        console.error(result.err);
                        checkComplete();
                    }else{
                        let service_category_id = result.res.id;
                        let num_translations = translations.length;
                        let count = -1;
    
                        translations.forEach(translation => {                
                            let ui_color;
    
                            if(arg.locale_id == translation.id){
                                ui_color = consts.STATUS_COLOR.published;
                            }else{
                                ui_color = consts.STATUS_COLOR.pending_action;
                            }
    
                            let values = [
                                arg.branch_id,
                                service_category_id,
                                translation.id,
                                arg.name,
                                ui_color
                            ];
    
                            pgQueries.createServiceCategoryTranslation(values, result => {
                                if(result.err){
                                    console.error(result.err);
                                }
                                checkComplete();
                            });
                        });
    
                        
                        checkComplete();
            
                        function checkComplete(){
                            count++;
                            if(count == num_translations){
                                return resolve({
                                    status: "success",
                                    message: "New service category created successfully"
                                });
                            }
                        }
                    }
                });
            });
        });
    });
}

module.exports = async (parents, args) => {
    return getData(args);
}
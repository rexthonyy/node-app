const pgQueries = require('../../postgres/macro-queries');

const getData = () => {
    return new Promise((resolve, reject) => {
        pgQueries.getMacros(result => {
            if(result.err){
                return reject(result.err);
            }

            let macros = result.res;
            let numMacros = macros.length;
            let count = -1;

            macros.forEach(macro => {
                pgQueries.getGroupMacrosByMacroId([macro.id], result => {
                    macro.group_ids = [];
                    if(result.res){
                        let group_macros = result.res;
                        group_macros.forEach(group_macro => {
                            macro.group_ids.push(group_macro.group_id);
                        });
                    }
                    checkComplete();
                });
            });

            checkComplete();

            function checkComplete(){
                count++;
                if(count == numMacros){
                    resolve(macros);
                }
            }
        });
    });
}

module.exports = async (parent, args) => {
    let result = await getData();
    return result;
}
const pgQueries = require('../../postgres/macro-queries');

const getData = ({macro_id}) => {
    return new Promise((resolve, reject) => {
        pgQueries.getMacrosById([macro_id], result => {
            if(result.err || result.res.length == 0){
                return reject(result.err);
            }

            let macro = result.res[0];

            pgQueries.getGroupMacrosByMacroId([macro.id], result => {
                macro.group_ids = [];
                if(result.res){
                    let group_macros = result.res;
                    group_macros.forEach(group_macro => {
                        macro.group_ids.push(group_macro.group_id);
                    });
                }
                
                resolve(macro);
            });
        });
    });
}

module.exports = async (parent, args) => {
    return await getData(args);
}
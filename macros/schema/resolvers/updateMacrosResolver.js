const pgQueries = require('../../postgres/macro-queries');

const getData = ({macro_id, name, group_ids, perform, active, ux_flow_next_up, note, updated_by_id, created_by_id}) => {
    return new Promise((resolve, reject) => {
        pgQueries.getMacrosById([macro_id], result => {
            if(result.err || result.res.length == 0){
                return reject("Macro not found : " + result.err);
            }

            let macro = result.res[0];

            let values = [
                macro_id,
                name,
                perform,
                active,
                ux_flow_next_up,
                note,
                updated_by_id,
                created_by_id,
                macro.created_at,
                new Date().toUTCString()
            ];
    
            pgQueries.updateMacro(values, result => {
                if(result.err){
                    return reject(result.err);
                }
    
                pgQueries.deleteGroupMacrosByMacroId([macro_id], result => {        
                    let numGroups = group_ids.length;
                    let count = -1;
        
                    group_ids.forEach(group_id => {
                        values = [
                            macro_id,
                            group_id
                        ];
                        pgQueries.createGroupMacros(values, result => {
                            checkComplete();
                        });
                    });
        
                    checkComplete();
        
                    function checkComplete(){
                        count++;
                        if(count == numGroups){
                            resolve({
                                status: "success",
                                message: "Macro updated successfully!"
                            });
                        }
                    }
                });
            });
        });
    });
}

module.exports = async (parent, args) => {
    return await getData(args);
}
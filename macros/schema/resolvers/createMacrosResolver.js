const pgQueries = require('../../postgres/macro-queries');

const getData = ({name, group_ids, perform, active, ux_flow_next_up, note, updated_by_id, created_by_id, created_at, updated_at}) => {
    return new Promise((resolve, reject) => {
        let values = [
            name,
            perform,
            active,
            ux_flow_next_up,
            note,
            updated_by_id,
            created_by_id,
            created_at,
            updated_at
        ];

        pgQueries.createMacros(values, result => {
            if(result.err){
                return reject(result.err);
            }

            let macro_id = result.res.id;

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
                        message: "Macro created successfully!"
                    });
                }
            }
        });
    });
}

module.exports = async (parent, args) => {
    let result = await getData(args)
    return result;
}
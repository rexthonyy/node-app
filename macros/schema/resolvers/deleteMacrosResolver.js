const pgQueries = require('../../postgres/macro-queries');

const getData = ({macro_id}) => {
    return new Promise((resolve, reject) => {
        pgQueries.deleteMacrosById([macro_id], result => {
            pgQueries.deleteGroupMacrosByMacroId([macro_id], res => {
                resolve({
                    status: "success",
                    message: "Macro deleted successfully!"
                });
            });
        });
    });
}

module.exports = async (parent, args) => {
    return await getData(args);
}
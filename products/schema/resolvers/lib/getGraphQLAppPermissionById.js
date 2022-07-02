const permissionsdbQueries = require('../../../postgres/permissionsdb-queries');

let getGraphQLAppPermissionById = (id) => {
    return new Promise((resolve, reject) => {
        permissionsdbQueries.getAuthPermission([id], "id=$1", result => {
            if (result.err || result.res.length == 0) {
                return reject("Auth permission not found");
            }
            let permission = result.res[0];

            resolve({
                code: permission.codename,
                name: permission.name
            });
        });
    });
};

module.exports = getGraphQLAppPermissionById;
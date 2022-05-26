const { permissionEnum } = require('../../lib/consts');
const pgQueries = require('../../postgres/spicedb-queries');

const getData = ({permissionGroupFilterInput}) => {
    return new Promise((resolve, reject) => {
        let search = permissionGroupFilterInput.search;
        let ids = permissionGroupFilterInput.ids;

        search = search ? search : "";

        pgQueries.getAuthGroups(search, result => {
            if(result.err){
                return reject(result.err);
            }

            let authGroups = result.res;
            let numGroups = authGroups.length;
            let count = -1;
            let permissionGroups = [];

            authGroups.forEach(authGroup => {
                let authGroupId = authGroup.id;
                let authGroupName = authGroup.name;
                pgQueries.getAuthGroupPermissionsByGroupId([authGroupId], result => {
                    if(result.err){
                        return reject(result.err);
                    }

                    let authGroupPermissionIds = getPermissionIds(result.res);

                    permissionGroups.push({
                        name: authGroupName,
                        permissions: authGroupPermissionIds
                    });

                    checkComplete();
                });
            });

            checkComplete();

            function checkComplete(){
                count++;
                if(numGroups == count){
                    resolve(permissionGroups);
                }
            }
            
        });
    });
}

function getPermissionIds(authGroupPermissions){
    let permissions = [];
    authGroupPermissions.forEach(auth_group_permission => {
        permissionEnum.forEach(enum => {
            
        });
        permissions.push(permissionEnum.find(enum => enum.id == auth_group_permission.permission_id ));
    });
    let inIds = "";
    for(let i = 0, j = ids.length; i < j; i++){
        if(i > 0){
            inIds += ",";
        }
        inIds += ids[i];
    }
    return inIds;
}

module.exports = async (parent, args) => {
    return getData(args);
}
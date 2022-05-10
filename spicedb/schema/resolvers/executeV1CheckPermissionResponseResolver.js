const pgQueries = require('../../postgres/spicedb-queries');

const getData = ({v1CheckPermissionRequestInput}) => {
    return new Promise((resolve, reject) => {
        let permission = v1CheckPermissionRequestInput.permission;
        let resource = v1CheckPermissionRequestInput.resource;
        let subject = v1CheckPermissionRequestInput.subject;

        pgQueries.getRelationTupleByRelation([relation], result => {
            if(result.err){
                return reject(result.err);
            }

            if(result.res.length == 0){
                return resolve({
                    permissionship: "PERMISSIONSHIP_UNSPECIFIED"
                });
            }else{
                pgQueries.getRelationTupleByNamespaceObjectIdAndRelation([subject, resource, permission], result => {
                    if(result.err){
                        return reject(result.err);
                    }
        
                    let relation_tuple = result.res;
        
                    if(relation_tuple.length == 0){
                        return resolve({
                            permissionship: "PERMISSIONSHIP_NO_PERMISSION"
                        });
                    }else{
                        return resolve({
                            permissionship: "PERMISSIONSHIP_HAS_PERMISSION"
                        });
                    }
                });
            }
        });
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}
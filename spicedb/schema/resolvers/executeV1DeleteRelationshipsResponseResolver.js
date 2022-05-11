const pgQueries = require('../../postgres/spicedb-queries');

const getData = ({v1DeleteRelationshipsRequestInput}) => {
    return new Promise((resolve, reject) => {
        let permission = v1DeleteRelationshipsRequestInput.optionalRelation;
        let resource = v1DeleteRelationshipsRequestInput.optionalResourceId;
        let subject = v1DeleteRelationshipsRequestInput.optionalSubjectFilter;

        let whereClause = "";
        let values = [];
        let index = 0;

        if(permission){
            index++;
            whereClause += `relation=$${index}`;
            values.push(permission);
        }
        
        if(resource){
            if(whereClause) whereClause += " AND ";
            index++;
            whereClause += `object_id=$${index}`;
            values.push(resource);
        }

        if(subject){
            if(whereClause) whereClause += " AND ";
            index++;
            whereClause += `namespace=$${index}`;
            values.push(subject);
        }
        
        pgQueries.deleteRelationTuples(whereClause, values, result => {
            if(result.err){
                console.log(result.err);
                return reject(result.err);
            }
            
            resolve({
                status: "success"
            });
        });
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}
const pgQueries = require('../../postgres/spicedb-queries');

const getData = ({v1WriteRelationshipsRequestInput}) => {
    return new Promise((resolve, reject) => {
        let writeRelationships = [];

        v1WriteRelationshipsRequestInput.updates.forEach(update => {
            writeRelationships.push({
                permission: update.filter.optionalRelation,
                resource: update.filter.optionalResourceId,
                subject: update.filter.optionalSubjectFilter
            });
        });

        console.log(writeRelationships);

        let numRelations = writeRelationships.length;
        let count = 0;

        writeRelationships.forEach(relationship => {
            let permission = relationship.permission;
            let resource = relationship.resource;
            let subject = relationship.subject;

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

            console.log(whereClause);
            console.log(values);
            
            pgQueries.getRelationTuples(whereClause, values, result => {
                if(result.err){
                    console.log(result.err);
                    return reject(result.err);
                }

                let relation_tuples = result.res;
                if(relation_tuples.length > 0){
                    checkComplete();
                }else{
                    writeRelation();
                }
            });

            function writeRelation(){
                pgQueries.createRelationTuple([
                    subject,
                    resource,
                    permission
                ], result => {
                    if(result.err){
                        console.log(result.err);
                        return reject(result.err);
                    }

                    console.log(result.res);
                    checkComplete();
                });
            }
        });

        checkComplete();

        function checkComplete(){
            count++;
            if(count == numRelations){
                resolve({
                    token: Date.now()
                });
            }
        }
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}
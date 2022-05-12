const pgQueries = require('../../postgres/spicedb-queries');

const getData = ({v1ReadRelationshipsRequestInput}) => {
    return new Promise((resolve, reject) => {
        let permission = v1ReadRelationshipsRequestInput.relationshipFilter.optionalRelation;
        let resource = v1ReadRelationshipsRequestInput.relationshipFilter.optionalResourceId;
        let subject = v1ReadRelationshipsRequestInput.relationshipFilter.optionalSubjectFilter;

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
        
        pgQueries.getRelationTuples(whereClause, values, result => {
            if(result.err){
                console.log(result.err);
                return reject(result.err);
            }
            
            let relationships = [];
            let relation_tuples = result.res;
            relation_tuples.forEach(tuple => {
                relationships.push({
                    relation: tuple.relation,
                    resource: tuple.object_id,
                    subject: tuple.namespace
                });
            });
            resolve(relationships);
        });
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}
const pgQueries = require('../../postgres/spicedb-queries');

const getData = ({v1LookupResourcesRequestInput}) => {
    return new Promise((resolve, reject) => {
        let permission = v1LookupResourcesRequestInput.permission;
        let subject = v1LookupResourcesRequestInput.subject;

        pgQueries.getRelationTuplesByNamespaceAndRelation([subject, permission], result => {
            if(result.err){
                console.log(result.err);
                return reject(result.err);
            }

            let relation_tuples = result.res;

            let objectIds = [];

            relation_tuples.forEach(tuple => {
                objectIds.push({
                    objectId: tuple.object_id
                });
            });
            
            resolve(objectIds);
        });
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}
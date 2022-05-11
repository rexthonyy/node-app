const pgQueries = require('../../postgres/spicedb-queries');

const getData = ({v1LookupResourcesRequestInput}) => {
    return new Promise((resolve, reject) => {
        let permission = v1LookupResourcesRequestInput.permission;
        let subject = v1LookupResourcesRequestInput.subject.object.objectId;

        pgQueries.getRelationTuplesByNamespaceAndRelation([subject, permission], result => {
            if(result.err){
                console.log(result.err);
                return reject(result.err);
            }

            let relation_tuples = result.res;

            let resourceObjectId = [];
            let error = null;

            relation_tuples.forEach(tuple => {
                resourceObjectId.push(tuple.object_id);
            });

            resolve({
                error,
                resourceObjectId
            });
        });
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}
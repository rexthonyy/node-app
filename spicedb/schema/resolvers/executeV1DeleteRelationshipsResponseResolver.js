const pgQueries = require('../../postgres/spicedb-queries');

const getData = ({v1DeleteRelationshipsRequestInput}) => {
    return new Promise((resolve, reject) => {
        let permission = v1DeleteRelationshipsRequestInput.relationshipFilter.optionalRelation;
        let resource = v1DeleteRelationshipsRequestInput.relationshipFilter.optionalResourceId;
        let subject = v1DeleteRelationshipsRequestInput.relationshipFilter.optionalSubjectFilter;

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
        console.log("");
        console.log(values);
        resolve({
            status: "success"
        });
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}
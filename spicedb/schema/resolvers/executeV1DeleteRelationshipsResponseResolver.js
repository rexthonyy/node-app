const pgQueries = require('../../postgres/spicedb-queries');

const deletePermission = (permission) => {

};

const deleteRelation = (relation) => {

};

const deleteSubject = (subject) => {

};

const getData = ({v1DeleteRelationshipsRequestInput}) => {
    return new Promise((resolve, reject) => {
        let permission = v1DeleteRelationshipsRequestInput.relationshipFilter.optionalRelation;
        let resource = v1DeleteRelationshipsRequestInput.relationshipFilter.optionalResourceId;
        let subject = v1DeleteRelationshipsRequestInput.relationshipFilter.optionalSubjectFilter;

        console.log(permission);
        console.log(resource);
        console.log(subject);
        
        resolve({
            status: "success"
        });
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}
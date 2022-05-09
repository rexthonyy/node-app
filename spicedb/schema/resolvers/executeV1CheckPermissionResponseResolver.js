const pgKratosQueries = require('../../postgres/spicedb-queries');

const getData = ({v1CheckPermissionRequestInput}) => {
    return new Promise((resolve, reject) => {
        let consistency = v1CheckPermissionRequestInput.consistency;
        let permission = v1CheckPermissionRequestInput.permission;
        let resource = v1CheckPermissionRequestInput.resource;
        let subject = v1CheckPermissionRequestInput.subject;

        let atExactSnapshot = consistency.atExactSnapshot;
        let atLeastAsFresh = consistency.atLeastAsFresh;
        let fullyConsistent = consistency.fullyConsistent;
        let minimizeLatency = consistency.minimizeLatency;

        let atExactSnapshot_token = atExactSnapshot.token;
        let atLeastAsFresh_token = atLeastAsFresh.token;
        
        let resource_objectId = resource.objectId;
        let resource_objectType = resource.objectType;

        let object = subject.object;
        let optionalRelation = subject.optionalRelation;

        let object_objectId = object.objectId;
        let object_objectType = object.objectType;

        reject("");
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}
const util = require('./util');
const consts = require('./consts');

function updateRelationTuple(subject, relation, object, cb){
    let endpoint = `${consts.LOCAL_URL}:${consts.KETO_WRITE_PORT}/relation-tuples`;
    let options =  {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            namespace: consts.KETO_NAMESPACE,
            object: object,
            relation: relation,
            subject_id: subject
        })
    };
    util.sendRequest(endpoint, options)
    .then(json => {   
        json.status = "success";
        cb(json);
    }).catch(err => {
        cb({status: "error", message: err});
    });
}

function checkRelationTuple(subject, relation, object, cb){
    let endpoint = `${consts.LOCAL_URL}:${consts.KETO_READ_PORT}/check?namespace=${consts.KETO_NAMESPACE}&object=${object}&relation=${relation}&subject_id=${subject}`;
    util.sendRequest(endpoint)
    .then(json => {   
        cb(json);
    }).catch(err => {
        cb(err);
    });
}

function expandRelationTuple(relation, object, cb){
    let endpoint = `${consts.LOCAL_URL}:${consts.KETO_READ_PORT}/expand?namespace=${consts.KETO_NAMESPACE}&object=${object}&relation=${relation}&max-depth=5`;
    util.sendRequest(endpoint)
    .then(json => {   
        cb(json);
    }).catch(err => {
        cb(err);
    });
}

function queryRelationTuple(subject_id, relation, object, cb){
    let endpoint = `${consts.LOCAL_URL}:${consts.KETO_READ_PORT}/relation-tuples?namespace=${consts.KETO_NAMESPACE}&object=${object}&relation=${relation}&subject_id=${subject_id}`;
    util.sendRequest(endpoint)
    .then(json => {   
        cb(json);
    }).catch(err => {
        cb(err);
    });
}

function deleteRelationTuple(subject_id, relation, object, cb){
    let url = `${consts.LOCAL_URL}:${consts.KETO_WRITE_PORT}/relation-tuples?namespace=${consts.KETO_NAMESPACE}&object=${object}&relation=${relation}&subject_id=${subject_id}`;
    //console.log(url);
    let endpoint = url;
    let options =  {
        method: "DELETE"
    };
    util.sendRequest(endpoint, options)
    .then(json => {   
        console.log(json);
        cb(json);
    }).catch(err => {
        console.log(err);
        cb(err);
    });
}

function updateRelation(subject, relation, object, cb){
    updateRelationTuple(subject, relation, object, (response) => {
        cb(response);
    });
}


function checkRelation(subject, relation, object, cb){
    checkRelationTuple(subject, relation, object, (response) => {
        cb(response);
    });
}


function expandRelation(relation, object, cb){
    expandRelationTuple(relation, object, (response) => {
        cb(response);
    });
}

function queryRelation(subject, relation, object, cb){
    queryRelationTuple(subject, relation, object, (response) => {
        cb(response);
    });
}

function deleteRelation(subject, relation, object, cb){
    deleteRelationTuple(subject, relation, object, (response) => {
        cb(response);
    });
}


module.exports = {
    updateRelation,
    checkRelation,
    expandRelation,
    queryRelation,
    deleteRelation
};
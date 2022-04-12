const pgQueries = require('../../postgres/kb-queries');

let setOrderForKnowledgebases = (kb_ids, cb) => {
    let positionOrder = [];

    for(let i = 0; i < kb_ids.length; i++){
        positionOrder.push({
            kb_id: kb_ids[i],
            position: (i+1)
        });
    }

    let numPositions = positionOrder.length;
    let count = -1;
    
    positionOrder.forEach(order => {
        let values = [
            order.kb_id,
            order.position
        ];

        pgQueries.updatePositionForKnowledgeBase(values, result => {    
            checkComplete();
        });
    });

    checkComplete();

    function checkComplete(){
        count++;
        if(numPositions == count){
            cb();
        }
    }
}

module.exports = setOrderForKnowledgebases;
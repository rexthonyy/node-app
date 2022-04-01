const pgQueries = require('../../postgres/kb-queries');

const getData = ({knowledge_base_ids}) => {
    return new Promise((resolve, reject) => {
        let positionOrder = [];

        for(let i = 0; i < knowledge_base_ids.length; i++){
            positionOrder.push({
                kb_id: knowledge_base_ids[i],
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
                resolve({
                    status: "success",
                    message: "Positions updated successfully!"
                });
            }
        }        
    });
}

module.exports = async (parent, args) => {
    let result = await getData(args)
    return result;
}
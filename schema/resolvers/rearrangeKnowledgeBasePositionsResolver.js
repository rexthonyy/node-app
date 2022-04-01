const pgQueries = require('../../postgres/kb-queries');

const getData = ({knowledgebaseIds}) => {
    return new Promise((resolve, reject) => {
        let positionOrder = [];

        for(let i = 0; i < knowledgebaseIds.length; i++){
            positionOrder.push({
                kb_id: knowledgebaseIds[i],
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
const pgQueries = require('../../postgres/kb-queries');

const getData = ({category_ids}) => {
    return new Promise((resolve, reject) => {

        let positionOrder = [];

        for(let i = 0; i < category_ids.length; i++){
            positionOrder.push({
                category_id: category_ids[i],
                position: (i+1)
            });
        }

        let numPositions = positionOrder.length;
        let count = -1;
        
        positionOrder.forEach(order => {
            let values = [
                order.category_id,
                order.position
            ];

            pgQueries.updatePositionForKnowledgeBaseCategory(values, result => {    
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

module.exports = async (parents, args) => {
    return getData(args);
}
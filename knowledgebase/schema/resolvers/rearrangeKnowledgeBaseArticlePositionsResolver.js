const pgQueries = require('../../postgres/kb-queries');

const getData = ({article_ids}) => {
    return new Promise((resolve, reject) => {

        let positionOrder = [];

        for(let i = 0; i < article_ids.length; i++){
            positionOrder.push({
                article_id: article_ids[i],
                position: (i+1)
            });
        }

        let numPositions = positionOrder.length;
        let count = -1;
        
        positionOrder.forEach(order => {
            let values = [
                order.article_id,
                order.position
            ];

            pgQueries.updatePositionForKnowledgeBaseArticle(values, result => {    
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
    return getData(args);
}
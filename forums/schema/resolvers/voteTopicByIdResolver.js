const pgForumQueries = require('../../postgres/forum-queries');
const getTopicById = require('../resolverUtils/getTopicById');

const getData = ({topic_id}) => {
    return new Promise((resolve, reject) => {
        pgForumQueries.getTopicPoints(topic_id, result => {
            if(result.err){
                return reject(result.err);
            }
            let points = result.res[0].points;
            points++;
            pgForumQueries.updateTopicPoints(topic_id, points, result1 => {
                if(result1.err){
                    return reject(result1.err);
                }
    
                getTopicById(topic_id, topic => {
                    resolve(topic);
                });
            });
        });
    });
}

module.exports = async (parent, args) => {
    return await getData(args);
}
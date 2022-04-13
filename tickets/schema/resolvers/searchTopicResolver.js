const pgForumQueries = require('../../postgres/forum-queries');
const getTopicById = require('../resolverUtils/getTopicById');

const getData = ({query}) => {
    return new Promise((resolve, reject) => {
        pgForumQueries.searchTopics(query, response => {
            if(response.err){
                return reject(response.err);
            }

            let topics = response.res;
            let topics_type = [];
            let count = -1;
            let numTopics = topics.length;

            topics.forEach(topic => {
                getTopicById(topic.id, tp => {
                    topics_type.push(tp);
                    checkComplete();
                });
            });

            checkComplete();

            function checkComplete(){
                count++;
                if(count == numTopics){
                    resolve(topics_type);
                }
            }
        });
    });
}

module.exports = async (parent, args) => {
    let result = await getData(args)
    return result;
}
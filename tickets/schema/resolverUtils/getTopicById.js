const pgForumQueries = require('../../postgres/forum-queries');

let getTopicById = (topic_id, cb) => {
    pgForumQueries.getTopicsById(topic_id, result => {
        if(result.err){
            return cb(result.err);
        }
        let topics = result.res;
        let count = -1;

        topics.forEach(topic => {
            pgForumQueries.getPostsByTopicId(topic.id, result1 => {
                if(result1.err){
                    return cb(result1.err);
                }
                topic.posts = result1.res;
                setTopicsToForum();
            });
        });

        setTopicsToForum();

        function setTopicsToForum(){
            count++;
            if(topics.length == count){
                cb(topics[0]);
            }
        }
    });
};

module.exports = getTopicById;
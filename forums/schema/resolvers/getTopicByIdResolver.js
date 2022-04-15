const pgForumQueries = require('../../postgres/forum-queries');

const getData = ({topic_id}) => {
    return new Promise((resolve, reject) => {
        pgForumQueries.getTopicsById(topic_id, result => {
            if(result.err){
                return reject(result.err);
            }
            
            let topics = result.res;
            let count = -1;
    
            topics.forEach(topic => {
                pgForumQueries.getPostsByTopicId(topic.id, result1 => {
                    if(result1.err){
                        return reject(result1.err);
                    }
                    topic.posts = result1.res;
                    setTopicsToForum();
                });
            });
    
            setTopicsToForum();
    
            function setTopicsToForum(){
                count++;
                if(topics.length == count){
                    resolve(topics[0]);
                }
            }
        });
    });
}

module.exports = async (parent, args) => {
    return await getData(args);
}
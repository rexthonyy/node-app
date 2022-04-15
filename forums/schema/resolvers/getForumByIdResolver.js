const pgForumQueries = require('../../postgres/forum-queries');

const getData = ({forum_id}) => {
    return new Promise((resolve, reject) => {
        pgForumQueries.getForumsById(forum_id, result => {
            if(result.err){
                return reject(result.err);
            }
            let forums = result.res;
            if(forums.length != 1) return reject({ status: "Not found"});
    
            pgForumQueries.getTopicsByForumId(forum_id, result1 => {
                if(result1.err){
                    return reject(result1.err);
                }
                let topics = result1.res;
                let count = -1;
    
                topics.forEach(topic => {
                    pgForumQueries.getPostsByTopicId(topic.id, result2 => {
                        if(result2.err){
                            return reject(result2.err);
                        }
                        topic.posts = result2.res;
                        setTopicsToForum();
                    });
                });
    
                setTopicsToForum();
    
                function setTopicsToForum(){
                    count++;
                    if(topics.length == count){
                        forums[0].topics = topics;
    
                        resolve(forums[0]);
                    }
                }
            });
        });
    });
}

module.exports = async (parent, args) => {
    return await getData(args);
}
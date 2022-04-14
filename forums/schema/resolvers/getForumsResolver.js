const pgForumQueries = require('../../postgres/forum-queries');

const getData = () => {
    return new Promise((resolve, reject) => {
        pgForumQueries.getForums(result => {
            if(result.err){
                return reject(result.err);
            }
            let forums = result.res;
    
            let forum_count = -1;
    
            forums.forEach(forum => {
                pgForumQueries.getTopicsByForumId(forum.id, result1 => {
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
                            forum.topics = topics;
                            submitForumToFrontEnd();
                        }
                    }
                });
            });
    
            submitForumToFrontEnd();
    
            function submitForumToFrontEnd(){
                forum_count++;
                if(forums.length == forum_count){
                    resolve(forums);
                }
            }
        });
    });
}

module.exports = async () => {
    let result = await getData()
    return result;
}
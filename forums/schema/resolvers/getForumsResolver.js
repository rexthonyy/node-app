const pgForumQueries = require('../../postgres/forum-queries');

const getData = () => {
    return new Promise((resolve, reject) => {
        pgForumQueries.getForums(result => {
            if(result.err || result.res.length == 0){
                return reject(JSON.stringify(result.err));
            }
            let forums = result.res;
            let forum_count = -1;
    
            forums.forEach(forum => {
                pgForumQueries.getTopicsByForumId(forum.id, result1 => {
                    if(result1.err || result1.res.length == 0){
                        console.log("Topic not found");
                        forum.topics = [];
                        setTopicsToForum();
                    }else{
                        let topics = result1.res;
                        let count = -1;
        
                        topics.forEach(topic => {
                            pgForumQueries.getPostsByTopicId(topic.id, result2 => {
                                if(result2.err || result2.res.length == 0){
                                    console.log("Post not found");
                                    topic.posts = [];
                                    setTopicsToForum();
                                }else{
                                    topic.posts = result2.res;
                                    setTopicsToForum();
                                }
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
    return getData();
}
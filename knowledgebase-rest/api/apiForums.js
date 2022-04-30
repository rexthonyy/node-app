const express = require("express");
const router = express.Router();
const pgForumQueries = require('../postgres/forum-queries');
const util = require('../util');

function returnResult(res, result){
    if(result.err){
        return res.json(result.err);
    }
    res.json(result.res);
}

function returnResultcb(res, cb, result){
    if(result.err){
        return res.json(result.err);
    }
    cb(result.res);
}


router.post("/schedulePostUpdate", (req, res) => {
    let post_id = req.body.post_id;
    let run_at = req.body.run_at;
    let update_metadata = JSON.stringify(req.body.update_metadata);

    let values = [
        post_id,
        true
    ];

    pgForumQueries.updateForumPostUpdateSchedule(values, result => {
        if(result.err){
            return res.json(result.err);
        }

        let values1 = [
            post_id,
            "update",
            update_metadata,
            run_at
        ];

        pgForumQueries.createForumPostDelayedJob(values1, result => {
            if(result.err){
                return res.json(result.err);
            }

            res.json({ status: "success", message: "Post scheduled for update" });
        });
    });
});

router.post("/schedulePostDelete", (req, res) => {
    let post_id = req.body.post_id;
    let run_at = req.body.run_at;

    let values = [
        post_id,
        "delete",
        "",
        run_at
    ];

    pgForumQueries.createForumPostDelayedJob(values, result => {
        if(result.err){
            return res.json(result.err);
        }

        values = [
            post_id,
            true
        ];

        pgForumQueries.updateForumPostDeleteSchedule(values, result => {
            if(result.err){
                result.err.errorIndex = 36221;
                return res.json(result.err);
            }

            res.json({ status: "success", message: "Post scheduled for deletion" });
        });
    });
});

router.get('/getForums', (req, res) => {
    pgForumQueries.getForums(result => {
        if(result.err){
            result.err.errorIndex = 746821;
            return result.err;
        }

        let forums = result.res;
        let numForums = forums.length;
        let count = -1;

        forums.forEach(forum => {
            pgForumQueries.getTopicsByForumId(forum.id, result => {
                if(result.err){
                    return checkComplete();
                }

                forum.topics_count = result.res.length;
                forum.last_post_date = null;
                forum.last_post_id = null;
                if(forum.topics_count != 0){
                    forum.last_post_date = result.res[forum.topics_count - 1].updated_at;
                    forum.last_post_id = result.res[forum.topics_count - 1].id;
                }

                checkComplete();
            });
        });

        checkComplete();

        function checkComplete(){
            count++;
            if(count == numForums){
                forums.sort(util.sortByUpdatedAt);
                res.json(util.paginate(req,forums));
            }
        }
    });
});

router.post("/createForum", (req, res) => {
    createForum(req, res, cb => {
        res.json(cb);
    });
});

function createForum(req, res, cb){
    let values = getForumData(req);

    pgForumQueries.createForum(res, cb, values, returnResultcb);
}

router.put("/updateForum/:id", (req, res) => {
    updateForum(req, res, cb => {
        res.json(cb);
    });
});

function getForumData(req){
    return [
        req.body.name ? req.body.name : "",
        req.body.description ? req.body.description : "",
        req.body.topics_count ? req.body.topics_count : 0,
        req.body.last_post_date ? req.body.last_post_date: new Date().toUTCString(),
        req.body.last_post_id ? req.body.last_post_id : null,
        req.body.private != undefined ? req.body.private : false,
        req.body.created_at ? req.body.created_at: new Date().toUTCString(),
        req.body.updated_at ? req.body.updated_at: new Date().toUTCString(),
        req.body.allow_topic_voting != undefined ? req.body.allow_topic_voting: false,
        req.body.allow_post_voting != undefined ? req.body.allow_post_voting: false,
        req.body.layout ? req.body.layout: ""
    ];
}

function updateForum(req, res, cb){
    let id = req.params.id;
    let values = [id, ...getForumData(req)];

    pgForumQueries.updateForum(values, result => {
        if(result.err){
            return res.json(result.err);
        }
        cb({ id: id, status: "success", message: "Forum updated" });
    });
}

router.delete("/deleteForum/:id", (req, res) => {
    let id = req.params.id;

    let data = {
        id: id
    };

    pgForumQueries.deleteForum(data, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Forum deleted successfully" });
    });
});




router.get('/getTopics', (req, res) => {
    pgForumQueries.getTopics(res, returnResult);
});

router.get('/getTopics/forum_id/:id', (req, res) => {
    let forum_id = req.params.id;
    pgForumQueries.getTopicsByForumId(forum_id, result => {
        if(result.err){
            result.err.errorIndex = 284742;
            return res.json(result.err);
        }

        res.json(result.res);
    });
});

router.post("/createTopic", (req, res) => {
    createTopic(req, res, topic => {
        res.json(topic);
    });
});

function createTopic(req, res, cb){
    let values = getTopicData(req);

    pgForumQueries.createTopic(res, values, returnResult);
}

function getTopicData(req){
    return [
        req.body.forum_id ? req.body.forum_id : 1,
        req.body.user_id ? req.body.user_id : null,
        req.body.subject ? req.body.subject : "",
        req.body.message ? req.body.message: "",
        req.body.points ? req.body.points : 0,
        req.body.created_at ? req.body.created_at: new Date().toUTCString(),
        req.body.updated_at ? req.body.updated_at: new Date().toUTCString()
    ];
}

router.put("/updateTopic/:id", (req, res) => {
    updateTopic(req, res, topic => {
        res.json(topic);
    });
});

function updateTopic(req, res, cb){
    let id = req.params.id;  
    let values = [id, ...getTopicData(req)];

    pgForumQueries.updateTopic(values, result => {
        if(result.err){
            return res.json(result.err);
        }
        cb({ id: id, status: "success", message: "Topic updated" });
    });
}

router.delete("/deleteTopic/:id", (req, res) => {
    let id = req.params.id;

    let data = {
        id: id
    };

    pgForumQueries.deleteTopic(data, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Topic deleted successfully" });
    });
});



router.get('/getPosts', (req, res) => {
    pgForumQueries.getPosts(res, returnResult);
});

router.get('/getPosts/topic_id/:topic_id', (req, res) => {
    let topic_id = req.params.topic_id;
    pgForumQueries.getPostsByTopicId(topic_id, result => {
        if(result.err){
            result.err.errorIndex = 773211;
            return result.err;
        }

        res.json(result.res);
    });
});

router.post("/createPost", (req, res) => {
    createPost(req, res, post => {
        res.json(post);
    });
});

function createPost(req, res, cb){    
    let values = [
        req.body.topic_id ? req.body.topic_id : 0,
        req.body.user_id ? req.body.user_id : 0,
        req.body.body ? req.body.body : "",
        req.body.kind ? req.body.kind: "",
        req.body.active ? req.body.active : true,
        req.body.created_at ? req.body.created_at : new Date().toUTCString(),
        req.body.updated_at ? req.body.updated_at: new Date().toUTCString(),
        req.body.points ? req.body.points: 0,
        req.body.attachments ? req.body.attachments: "",
        req.body.cc ? req.body.cc: "",
        req.body.bcc ? req.body.bcc: false,
        req.body.raw_email ? req.body.raw_email: 0,
        req.body.email_to_address ? req.body.email_to_address: ""
    ];
    
    pgForumQueries.createPost(values, res, cb, returnResultcb);
}

router.put("/updatePost/:id", (req, res) => {
    updatePost(req, res, post => {
        res.json(post);
    });
});

function updatePost(req, res, cb){
    let id = req.params.id;
    let data = {
        id: id,
        topic_id: req.body.topic_id ? req.body.topic_id : 0,
        user_id: req.body.user_id ? req.body.user_id : 0,
        body: req.body.body ? req.body.body : "",
        kind: req.body.kind ? req.body.kind: "",
        active: req.body.active ? req.body.active : true,
        created_at: req.body.created_at ? req.body.created_at : new Date().toUTCString(),
        updated_at: req.body.updated_at ? req.body.updated_at: new Date().toUTCString(),
        points: req.body.points ? req.body.points: 0,
        attachments: req.body.attachments ? req.body.attachments: "",
        cc: req.body.cc ? req.body.cc: "",
        bcc: req.body.bcc ? req.body.bcc: false,
        raw_email: req.body.raw_email ? req.body.raw_email: 0,
        email_to_address: req.body.email_to_address ? req.body.email_to_address: ""
    };
    
    pgForumQueries.updatePost(data, result => {
        if(result.err){
            return res.json(result.err);
        }
        cb({ id: id, status: "success", message: "Post updated" });
    });
}

router.delete("/deletePost/:id", (req, res) => {
    let id = req.params.id;

    let data = {
        id: id
    };

    pgForumQueries.deletePost(data, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Post deleted successfully" });
    });
});




router.get('/getFlags', (req, res) => {
    pgForumQueries.getFlags(res, returnResult);
});

router.post("/createFlag", (req, res) => {
    createFlag(req, res, flag => {
        res.json(flag);
    });
});

function createFlag(req, res, cb){
    let post_id = req.body.post_id ? req.body.post_id : null;
    let generated_topic_id = req.body.generated_topic_id ? req.body.generated_topic_id : null;
    let reason = req.body.reason ? req.body.reason : "";
    let created_at = req.body.created_at ? req.body.created_at : new Date().toUTCString();
    let updated_at = req.body.updated_at ? req.body.updated_at: new Date().toUTCString();
    
    let values = [
        post_id,
        generated_topic_id,
        reason,
        created_at,
        updated_at
    ];
    
    pgForumQueries.createFlag(res, values, returnResultcb);
}

router.put("/updateFlag/:id", (req, res) => {
    let id = req.params.id;
    let post_id = req.body.post_id ? req.body.post_id : 0;
    let generated_topic_id = req.body.generated_topic_id ? req.body.generated_topic_id : 0;
    let reason = req.body.reason ? req.body.reason : "";
    let created_at = req.body.created_at ? req.body.created_at : new Date().toUTCString();
    let updated_at = req.body.updated_at ? req.body.updated_at: new Date().toUTCString();

    let data = {
        id: id,
        post_id: post_id,
        generated_topic_id: generated_topic_id,
        reason: reason,
        created_at: created_at,
        updated_at: updated_at
    };

    pgForumQueries.updateFlag(data, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Flag updated" });
    });
});

router.delete("/deleteFlag/:id", (req, res) => {
    let id = req.params.id;

    let data = {
        id: id
    };

    pgForumQueries.deleteFlag(data, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Flag deleted successfully" });
    });
});



router.get('/getTags', (req, res) => {
    getTags(req, res, tags => {
        res.json(tags);
    });
});

function getTags(req, res, cb){
    pgForumQueries.getTags(res, cb, returnResultcb);
}

router.post("/createTag", (req, res) => {
    createTag(req, res, tag => {
        res.json(tag);
    });
});

function createTag(req, res, cb){
    let data = getTagData(req);
    
    pgForumQueries.createTag(res, cb, data, returnResultcb);
}

router.put("/updateTag/:id", (req, res) => {
    updateTag(req, res, tag => {
        res.json(tag);
    });
});

function getTagData(req){
    return {
        name: req.body.name ? req.body.name : "",
        taggings_count: req.body.taggings_count ? req.body.taggings_count : 0,
        show_on_helpcenter: req.body.show_on_helpcenter ? req.body.show_on_helpcenter : false,
        show_on_admin: req.body.show_on_admin ? req.body.show_on_admin : false,
        show_on_dashboard: req.body.show_on_dashboard ? req.body.show_on_dashboard : false,
        description: req.body.description ? req.body.description : "",
        color: req.body.color ? req.body.color : "",
        active: req.body.active ? req.body.active: true,
        email_address: req.body.email_address ? req.body.email_address: "",
        email_name: req.body.email_name ? req.body.email_name: ""
    };
}

function updateTag(req, res, cb){
    let id = req.params.id;
    
    let data = getTagData(req);
    data.id = id;
    
    pgForumQueries.updateTag(data, result => {
        if(result.err){
            return res.json(result.err);
        }
        cb({ id: id, status: "success", message: "Tag updated" });
    });
}

router.delete("/deleteTag/:id", (req, res) => {
    let id = req.params.id;

    let data = {
        id: id
    };

    pgForumQueries.deleteTag(data, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Tag deleted successfully" });
    });
});


router.get('/getVotes', (req, res) => {
    pgForumQueries.getVotes(res, returnResult);
});

router.post("/createVote", (req, res) => {
    let points = req.body.points ? req.body.points : 0;
    let voteable_type = req.body.voteable_type ? req.body.voteable_type : "";
    let voteable_id = req.body.voteable_id ? req.body.voteable_id : 0;
    let user_id = req.body.user_id ? req.body.user_id : null;
    let created_at = req.body.created_at ? req.body.created_at : new Date().toUTCString();
    let updated_at = req.body.updated_at ? req.body.updated_at: new Date().toUTCString();

    let values = [
        points,
        voteable_type,
        voteable_id,
        user_id,
        created_at,
        updated_at
    ];

    pgForumQueries.createVote(res, values, returnResult);
});

router.put("/updateVote/:id", (req, res) => {
    let id = req.params.id;
    let points = req.body.points ? req.body.points : 0;
    let voteable_type = req.body.voteable_type ? req.body.voteable_type : "";
    let voteable_id = req.body.voteable_id ? req.body.voteable_id : 0;
    let user_id = req.body.user_id ? req.body.user_id : null;
    let created_at = req.body.created_at ? req.body.created_at : new Date().toUTCString();
    let updated_at = req.body.updated_at ? req.body.updated_at: new Date().toUTCString();

    let data = {
        id: id,
        points: points,
        voteable_type: voteable_type,
        voteable_id: voteable_id,
        user_id: user_id,
        created_at: created_at,
        updated_at: updated_at
    };

    pgForumQueries.updateVote(data, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Vote updated" });
    });
});

router.delete("/deleteVote/:id", (req, res) => {
    let id = req.params.id;

    let data = {
        id: id
    };

    pgForumQueries.deleteVote(data, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Vote deleted successfully" });
    });
});



// help api endpoints

// getApiV1ForumsId
router.get("/api/v1/forums/:id", (req, res) => {
    let forum_id = req.params.id;

    pgForumQueries.getForumsById(forum_id, result => {
        if(result.err){
            result.err.date = new Date().toUTCString();
            return res.json(result.err);
        }
        let forums = result.res;
        if(forums.length != 1) return res.status(404).json({ status: "Not found"});

        pgForumQueries.getTopicsByForumId(forum_id, result1 => {
            if(result1.err){
                return res.json(result1.err);
            }
            let topics = result1.res;
            let count = -1;

            topics.forEach(topic => {
                pgForumQueries.getPostsByTopicId(topic.id, result2 => {
                    if(result2.err){
                        return res.json(result2.err);
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

                    res.json(forums[0]);
                }
            }
        });
    });
});

// getApiV1Forums
router.get("/api/v1/forums", (req, res) => {
    pgForumQueries.getForums(result => {
        if(result.err){
            return res.json(result.err);
        }
        let forums = result.res;

        let forum_count = -1;

        forums.forEach(forum => {
            pgForumQueries.getTopicsByForumId(forum.id, result1 => {
                if(result1.err){
                    return res.json(result1.err);
                }
                let topics = result1.res;
                let count = -1;

                topics.forEach(topic => {
                    pgForumQueries.getPostsByTopicId(topic.id, result2 => {
                        if(result2.err){
                            return res.json(result2.err);
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
                res.json(forums);
            }
        }
    });
});

// postApiV1Forums
router.post("/api/v1/forums", (req, res) => {
    createForum(req, res, forum => {
        const forum_id = forum.id;
        pgForumQueries.getForumsById(forum_id, result => {
            if(result.err){
                result.err.flag = "error";
                return res.json(result.err);
            }
            let forums = result.res;
            if(forums.length != 1) return res.status(404).json({ status: "Not found"});
    
            pgForumQueries.getTopicsByForumId(forum_id, result1 => {
                if(result1.err){
                    return res.json(result1.err);
                }
                // get the topics
                let topics = result1.res;
                let count = -1 * 1;
    
                topics.forEach(topic => {
                    pgForumQueries.getPostsByTopicId(topic.id, result2 => {
                        if(result2.err){
                            result.err.flag = "error";
                            return res.json(result2.err);
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
    
                        res.json(forums[0]);
                    }
                }
            });
        });
    });
});

// patchApiV1Forums
router.put("/api/v1/forums/:id", (req, res) => {
    updateForum(req, res, forum => {
        const forum_id = forum.id;
        pgForumQueries.getForumsById(forum_id, result => {
            if(result.err){
                result.err.errorIndex = 2;
                return res.json(result.err);
            }
            let forums = result.res;
            if(forums.length != 1) return res.status(404).json({ status: "Not found"});
    
            pgForumQueries.getTopicsByForumId(forum_id, result1 => {
                if(result1.err){
                    result.err.errorIndex = 4;
                    return res.json(result1.err);
                }
                let topics = result1.res;
                let count = -1;
    
                topics.forEach(topic => {
                    pgForumQueries.getPostsByTopicId(topic.id, result2 => {
                        if(result2.err){
                            result.err.errorIndex = 8;
                            return res.json(result2.err);
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
    
                        res.json(forums[0]);
                    }
                }
            });
        });
    });
});




// getApiV1TopicsId
router.get("/api/v1/topics/:id", (req, res) => {
    let topic_id = req.params.id;
    pgForumQueries.getTopicsById(topic_id, result => {
        if(result.err){
            return res.json(result.err);
        }
        
        let topics = result.res;
        let count = -1;

        topics.forEach(topic => {
            pgForumQueries.getPostsByTopicId(topic.id, result1 => {
                if(result1.err){
                    return res.json(result1.err);
                }
                topic.posts = result1.res;
                setTopicsToForum();
            });
        });

        setTopicsToForum();

        function setTopicsToForum(){
            count++;
            if(topics.length == count){
                res.json(topics[0]);
            }
        }
    });
});

function returnTopics(req, res, topic_id){
    pgForumQueries.getTopicsById(topic_id, result => {
        if(result.err){
            result.err.errorIndex = 11;
            return res.json(result.err);
        }
        let topics = result.res;
        let count = -1;

        topics.forEach(topic => {
            pgForumQueries.getPostsByTopicId(topic.id, result1 => {
                if(result1.err){
                    result.err.errorIndex = 12;
                    return res.json(result1.err);
                }
                topic.posts = result1.res;
                setTopicsToForum();
            });
        });

        setTopicsToForum();

        function setTopicsToForum(){
            count++;
            if(topics.length == count){
                res.json(topics[0]);
            }
        }
    });
}

// postApiV1Topics
router.post("/api/v1/topics", (req, res) => {
    createTopic(req, res, topic => {
        returnTopics(req, res, topic.id);
    });
});

// patchApiV1TopicsId
router.put("/api/v1/topics/:id", (req, res) => {
    updateTopic(req, res, topic => {
        returnTopics(req, res, topic.id);
    });
});

// patchApiV1TopicsIdVote
router.put("/api/v1/topics/:id/vote", (req, res) => {
    let topic_id = req.params.id;
    pgForumQueries.getTopicPoints(topic_id, result => {
        if(result.err){
            return res.json(result.err);
        }
        let points = result.res[0].points;
        points++;
        pgForumQueries.updateTopicPoints(topic_id, points, result1 => {
            if(result1.err){
                return res.json(result1.err);
            }

            returnTopics(req, res, topic_id);
        });
    });
});




// postApiV1Posts
router.post("/api/v1/posts", (req, res) => {
    createPost(req, res, post => {
        res.json(post);
    });
});

// patchApiV1PostsId
router.put("/api/v1/posts/:id", (req, res) => {
    updatePost(req, res, post => {
        pgForumQueries.getPostById(res, post.id, returnResult);
    });
});




// postApiV1Flags
router.post("/api/v1/flags", (req, res) => {
    createFlag(req, res, flag => {
        res.json(flag);
    });
});




// getApiV1Tags
router.get("/api/v1/tags", (req, res) => {
    getTags(req, res, tags => {
        res.json(tags);
    });
});

// getApiV1TagsId
router.get("/api/v1/tags/:id", (req, res) => {
    const tag_id = req.params.id;
    pgForumQueries.getTagById(tag_id, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json(result.res);
    });
});

// postApiV1Tags
router.post("/api/v1/tags", (req, res) => {
    createTag(req, res, tag => {
        res.json(tag);
    })
});

// patchApiV1TagsId
router.put("/api/v1/tags/:id", (req, res) => {
    updateTag(req, res, tag => {
        let tag_id = tag.id;
        pgForumQueries.getTagById(res, tag_id, returnResult);
    })
});

// getApiV1Search
router.get("/api/v1/search", (req, res) => {
    let query = req.query.q ? req.query.q : "";
    let type = req.query.type ? req.query.type : "";

    if(query.trim() == "") return res.json({ status: "error", message: "Please enter a search term" });

    if(type.trim().toLowerCase() == "topic" || type.trim() == ""){
        pgForumQueries.searchTopics(query, response => {
            if(response.err){
                return res.json([]);
            }
            res.json(response.res);
        });
    }else{
        res.json([]);
    }
});
module.exports = router;
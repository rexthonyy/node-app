const pgForumQueries = require('../../postgres/forum-queries');

const getData = ({run_at, metadata}) => {
    return new Promise((resolve, reject) => {

        if(run_at != null){
            let run_at_date = new Date(run_at);
            if(run_at_date.getTime() < Date.now()){
                return resolve({ status: "error", message: "You cannot schedule to publish a topic in the past" });
            }
        }

        const post_id = -1;

        let update_metadata = JSON.stringify(metadata);
       
        let values = [
            post_id,
            "publish",
            update_metadata,
            new Date(run_at).toUTCString()
        ];

        pgForumQueries.createForumTopicDelayedJob(values, result => {
            if(result.err){
                return reject(result.err);
            }

            resolve({ status: "success", message: "Topic scheduled for publication" });
        });
    });
}

module.exports = async (parent, args) => {
    return await getData(args);
}
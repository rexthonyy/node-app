const pgForumQueries = require('../../postgres/forum-queries');

const getData = ({post_id, run_at, metadata}) => {
    return new Promise((resolve, reject) => {

        if(run_at != null){
            let run_at_date = new Date(run_at);
            if(run_at_date.getTime() < Date.now()){
                return resolve({ status: "error", message: "You cannot schedule to publish a post in the past" });
            }
        }

        let update_metadata = JSON.stringify(metadata);
        let values = [
            post_id,
            true
        ];
    
        pgForumQueries.updateForumPostUpdateSchedule(values, result => {
            if(result.err){
                return reject(result.err);
            }
    
            let values1 = [
                post_id,
                "update",
                update_metadata,
                new Date(run_at).toUTCString()
            ];
    
            pgForumQueries.createForumPostDelayedJob(values1, result => {
                if(result.err){
                    return reject(result.err);
                }
    
                resolve({ status: "success", message: "Post scheduled for update" });
            });
        });
    });
}

module.exports = async (parent, args) => {
    return await getData(args);
}
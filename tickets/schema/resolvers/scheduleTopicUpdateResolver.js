const pgForumQueries = require('../../postgres/forum-queries');

const getData = ({topic_id, run_at, metadata}) => {
    return new Promise((resolve, reject) => {

        if(run_at != null){
            let run_at_date = new Date(run_at);
            if(run_at_date.getTime() < Date.now()){
                return resolve({ status: "error", message: "You cannot schedule to update a topic in the past" });
            }
        }

        let update_metadata = JSON.stringify(metadata);

        let values = [
            topic_id,
            true
        ];
    
        pgForumQueries.updateForumTopicUpdateSchedule(values, result => {
            if(result.err){
                return reject(result.err);
            }

            let values1 = [
                topic_id,
                "update",
                update_metadata,
                new Date(run_at).toUTCString()
            ];
    
            pgForumQueries.createForumTopicDelayedJob(values1, result => {
                if(result.err){
                    return reject(result.err);
                }

                return resolve({ status: "success", message: "Topic scheduled for update" });
            });
        });
    });
}

module.exports = async (parent, args) => {
    let result = await getData(args)
    return result;
}
const pgForumQueries = require('../../postgres/forum-queries');

const getData = ({topic_id, run_at}) => {
    return new Promise((resolve, reject) => {

        if(run_at != null){
            let run_at_date = new Date(run_at);
            if(run_at_date.getTime() < Date.now()){
                return resolve({ status: "error", message: "You cannot schedule to delete a topic in the past" });
            }
        }

        let values = [
            topic_id,
            "delete",
            "",
            run_at
        ];
    
        pgForumQueries.createForumTopicDelayedJob(values, result => {
            if(result.err){
                return reject(result.err);
            }
    
            values = [
                topic_id,
                true
            ];
    
            pgForumQueries.updateForumTopicDeleteSchedule(values, result => {
                if(result.err){
                    result.err.errorIndex = 36221;
                    return reject(result.err);
                }
    
                resolve({ status: "success", message: "Topic scheduled for deletion" });
            });
        });
    });
}

module.exports = async (parent, args) => {
    return await getData(args);
}
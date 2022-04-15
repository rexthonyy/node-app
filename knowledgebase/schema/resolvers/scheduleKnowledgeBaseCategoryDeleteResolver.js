const pgQueries = require('../../postgres/kb-queries');
const consts = require('../../consts');

const getData = ({knowledge_base_category_translation_id, run_at, knowledge_base_id}) => {
    return new Promise((resolve, reject) => {

        if(run_at != null){
            let run_at_date = new Date(run_at);
            if(run_at_date.getTime() < Date.now()){
                return reject({ status: "error", message: "You cannot schedule to delete a category in the past" });
            }
        }
    
        let values = [
            knowledge_base_category_translation_id,
            run_at,
            knowledge_base_id,
            "delete"
        ];
    
        pgQueries.createKnowledgeBaseCategoryDelayedJob(values, result => {
            if(result.err){
                return res.json(result.err);
            }
    
            values = [
                knowledge_base_category_translation_id,
                true,
                consts.STATUS_COLOR.archive_scheduled
            ];
    
            pgQueries.updateKnowledgeBaseCategoryTranslationDeleteSchedule(values, result => {
                if(result.err){
                    result.err.errorIndex = 36221;
                    return reject(result.err);
                }
    
                resolve({ status: "success", message: "Knowledge base category translation scheduled for deletion" });
            });
        });
    });
}

module.exports = async (parent, args) => {
    return await getData(args);
}
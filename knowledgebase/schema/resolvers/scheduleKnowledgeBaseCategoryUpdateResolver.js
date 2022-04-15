const pgQueries = require('../../postgres/kb-queries');
const consts = require('../../consts');

const getData = ({knowledge_base_category_translation_id, run_at, knowledge_base_id, update_metadata}) => {
    return new Promise((resolve, reject) => {
        update_metadata = JSON.stringify(update_metadata);

        if(run_at != null){
            let run_at_date = new Date(run_at);
            if(run_at_date.getTime() < Date.now()){
                return reject({ status: "error", message: "You cannot schedule to update a category in the past" });
            }
        }
    
        let values = [
            knowledge_base_category_translation_id,
            true,
            update_metadata,
            consts.STATUS_COLOR.update_scheduled
        ];
    
        pgQueries.updateKnowledgeBaseCategoryTranslationUpdateSchedule(values, result => {
            if(result.err){
                return reject(result.err);
            }
    
            let values1 = [
                knowledge_base_category_translation_id,
                run_at,
                knowledge_base_id,
                "update"
            ];
    
            pgQueries.createKnowledgeBaseCategoryDelayedJob(values1, result => {
                if(result.err){
                    return reject(result.err);
                }
    
                resolve({ 
                    status: "success", 
                    message: "Knowledge base category translation scheduled for update" 
                });
            });
        });
    });
}

module.exports = async (parent, args) => {
    return await getData(args);
}
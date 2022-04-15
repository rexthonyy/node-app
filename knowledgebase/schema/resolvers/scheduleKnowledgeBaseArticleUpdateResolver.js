const pgQueries = require('../../postgres/kb-queries');
const recordHistory = require('../resolverUtils/recordHistoryResolver');

const getData = ({knowledge_base_article_translation_id, run_at, knowledge_base_id, article_id, update_metadata}) => {
    return new Promise((resolve, reject) => {
        update_metadata = JSON.stringify(update_metadata);

        if(run_at != null){
            let run_at_date = new Date(run_at);
            if(run_at_date.getTime() < Date.now()){
                return reject({ status: "error", message: "You cannot schedule to update an article in the past" });
            }
        }
    
        let values = [
            knowledge_base_article_translation_id,
            true,
            update_metadata
        ];
    
        pgQueries.updateKnowledgeBaseArticleTranslationUpdateSchedule(values, result => {
            if(result.err){
                result.err.errorIndex = 38272;
                return reject(result.err);
            }
    
            let values3 = [
                knowledge_base_id,
                article_id,
                knowledge_base_article_translation_id,
                run_at,
                "update"
            ];
    
            pgQueries.createKnowledgeBaseArticleDelayedJob(values3, result1 => {
                if(result1.err){
                    return reject(result1.err);
                }
    
    
                recordHistory(
                    "knowledgebase", 
                    "schedule-update-knowledgebasearticle", 
                    {
                        knowledge_base_id,
                        knowledge_base_article_translation_id,
                        run_at,
                        article_id,
                        update_metadata
                        //user_identity
                    }, 
                    () => {
                        resolve({ status: "success", message: "Knowledge base article translation scheduled for updated" });
                    }
                );
    
            });
        });
    });
}

module.exports = async (parent, args) => {
    return await getData(args);
}
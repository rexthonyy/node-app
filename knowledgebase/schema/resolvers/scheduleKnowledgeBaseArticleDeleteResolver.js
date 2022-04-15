const pgQueries = require('../../postgres/kb-queries');
const recordHistory = require('../resolverUtils/recordHistoryResolver');

const getData = ({knowledge_base_article_translation_id, run_at, knowledge_base_id, article_id}) => {
    return new Promise((resolve, reject) => {

        if(run_at != null){
            let run_at_date = new Date(run_at);
            if(run_at_date.getTime() < Date.now()){
                return reject({ status: "error", message: "You cannot schedule to delete an article in the past" });
            }
        }
    
        let values3 = [
            knowledge_base_id,
            article_id,
            knowledge_base_article_translation_id,
            run_at,
            "delete"
        ];
    
        pgQueries.createKnowledgeBaseArticleDelayedJob(values3, result1 => {
            if(result1.err){
                result1.err.errorIndex = 3277;
                return reject(result1.err);
            }
    
            values = [
                knowledge_base_article_translation_id,
                true
            ];
    
            pgQueries.updateKnowledgeBaseArticleTranslationDeleteSchedule(values, result => {
                if(result.err){
                    result.err.errorIndex = 306221;
                    return reject(result.err);
                }
    
                recordHistory(
                    "knowledgebase", 
                    "schedule-delete-knowledgebasearticle", 
                    {
                        knowledge_base_id,
                        knowledge_base_article_translation_id,
                        run_at,
                        article_id
                        //user_identity
                    }, 
                    () => {
                        resolve({ status: "success", message: "Knowledge base article translation scheduled for deletion" });
                    }
                );
            });
        });
    });
}

module.exports = async (parent, args) => {
    return await getData(args);
}
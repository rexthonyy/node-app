const pgQueries = require('../../postgres/kb-queries');
const consts = require('../../consts');
const setOrderForKnowledgebases = require('../resolverUtils/setOrderForKnowledgebases');
const util = require('../../util');

const getData = () => {
    return new Promise((resolve, reject) => {
        
        pgQueries.listKnowledgeBases(result => {
            if(result.err){
                return reject(result.err);
            }
            let knowledgebases = result.res;
            knowledgebases.forEach(knowledgebase => {
                knowledgebase.tooltip = consts.STATUS_COLOR_TEXT[knowledgebase.ui_color];
            });

            // get latest 
            let numKbs = knowledgebases.length;
            let latestKnowledgebase = knowledgebases[0] ? knowledgebases[0] : null;
            for(let i = 0; i < numKbs; i++){
                if(new Date(knowledgebases[i].created_at) > new Date(latestKnowledgebase.created_at)){
                    latestKnowledgebase = knowledgebases[i];
                }
            }

            if(latestKnowledgebase == null) return resolve(knowledgebases);

            knowledgebases = knowledgebases.filter(kb => kb.id != latestKnowledgebase.id);
            knowledgebases.sort(util.sortByPosition);
            knowledgebases.unshift(latestKnowledgebase);
            let kb_ids = [];
            knowledgebases.forEach(kb => {
                kb_ids.push(kb.id);
            });

            setOrderForKnowledgebases(kb_ids, () => {
                let knowledgebaseHybridStatType = [];
                let num_kbs = knowledgebases.length;
                let count = -1;
                
                knowledgebases.forEach(kb => {
                    pgQueries.getKnowledgeBaseCategoriesByKnowledgeBaseIdAndParentId(kb.id, -1, result => {
                        let num_categories = result.res.length;
                        pgQueries.getKnowledgeBaseArticlesByKnowledgeBaseIdAndCategoryId([kb.id, -1], result2 => {
                            let num_articles = result2.res.length;
                            knowledgebaseHybridStatType.push({
                                data: kb,
                                stat: {
                                    level: -1,
                                    num_categories,
                                    num_articles
                                }
                            });
                            checkComplete();
                        });
                    });
                });

                checkComplete();

                function checkComplete(){
                    count++;
                    if(count == num_kbs){
                        knowledgebaseHybridStatType.sort((a, b) => {
                            return a.data.position - b.data.position;
                        });
                        resolve(knowledgebaseHybridStatType);
                    }
                }
            });
        });
    });
}

module.exports = async () => {
    return getData();
}
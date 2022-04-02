const pgQueries = require('../../postgres/kb-queries');
const updateUIColorForKnowledgeBase = require('./updateKnowledgebaseUIColor');
const recordHistory = require('./recordHistoryResolver');
const util = require('../../util');

function getLanguageTitleFromLocaleId(locale_id, cb){
    pgQueries.getLocaleById(locale_id, result => {
        if(result.err){
            return cb("");
        }

        cb(result.res[0].name);
    });
}

const getData = ({knowledge_base_id, name, icon, footer, homepage_layout, category_layout, active, front_page, kb_locale_ids}) => {
    return new Promise((resolve, reject) => {
        
        let data = {
            knowledge_base_id,
            name,
            icon,
            footer,
            homepage_layout,
            category_layout,
            active,
            front_page,
            updated_at: new Date().toUTCString()
        };
    
        pgQueries.updateKnowledgeBase(data, result => {
            if(result.err){
                result.err.errorIndex = 32;
                return reject(result.err);
            }
    
            pgQueries.deleteKnowledgeBaseTranslationByKnowledgeBaseId(knowledge_base_id, result1 => {
                if(result1.err){
                    return reject(result1.err);
                }
    
                let numIds = kb_locale_ids.length;
                let count = -1;
    
                for(let i = 0; i < kb_locale_ids.length; i++){
                    let kb_locale_id = kb_locale_ids[i];
                    let position = i+1;
        
                    getLanguageTitleFromLocaleId(kb_locale_id.id, title => {
                        pgQueries.createKnowledgeBaseTranslation({
                            title: title,
                            footer_note: "",
                            kb_locale_id: kb_locale_id.id,
                            knowledge_base_id: knowledge_base_id,
                            active: kb_locale_id.default,
                            position: position,
                            ui_color: "red"
                        }, result2 => {
                            if(result2.err){
                                result1.err.errorIndex = -2;
                                return res.json(result2.err);
                            }
            
                            checkComplete();
                        });
                    });
                }
        
                checkComplete();
                
                function checkComplete(){
                    count++;
                    if(count == numIds){
                        updateUIColorForKnowledgeBase(knowledge_base_id, () => {
                            recordHistory(
                                "knowledgebase", 
                                "update-knowledgebase", 
                                {
                                    knowledge_base_id,
                                    name: req.body.name,
                                    //user_id,
            
                                }, 
                                () => {
                                    resolve({ status: "success", message: "Knowledge base updated successfully" });
                                }
                            );
                        });
                    }
                }
            });
        });
    });
}

module.exports = async (parents, args) => {
    let result = await getData(args)
    return result;
}
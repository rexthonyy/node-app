const pgQueries = require('../../postgres/kb-queries');
const recordHistory = require('../resolverUtils/recordHistoryResolver');
const getLanguageTitleFromLocaleId = require('../resolverUtils/getLanguageTitleFromLocaleId');
const consts = require('../../consts');

const getData = ({name, icon, footer, homepage_layout, category_layout, active, front_page, kb_locale_ids}) => {
    return new Promise((resolve, reject) => {
        
        if(kb_locale_ids.length == 0) return reject(JSON.stringify({ status: "error", message: "Not allowed, please provide a language selection for this knowledgebase"}));

        let data = {
            name,
            icon,
            footer,
            homepage_layout,
            category_layout,
            active,
            front_page
        };

        pgQueries.createKnowledgeBase(data, result => {
            if(result.err){
                return reject();
            }

            let knowledge_base = result.res;
            let knowledge_base_id = knowledge_base.id;
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
                        ui_color: consts.STATUS_COLOR.pending_action
                    }, result1 => {
                        if(result1.err){
                            result1.err.errorIndex = -1;
                            return reject(result1);
                        }
        
                        checkComplete();
                    });
                });
            }

            checkComplete();
            
            function checkComplete(){
                count++;
                if(count == numIds){
                    knowledge_base.locales = kb_locale_ids;
                    recordHistory(
                        "knowledgebase", 
                        "create-knowledgebase", 
                        {
                            knowledge_base_id,
                            name: knowledge_base.name,
                            //user_id,

                        }, 
                        () => {
                            resolve({
                                status: "success",
                                message: "Knowledge base created successfully"
                            });
                        }
                    );
                }
            }
        });
    });
}

module.exports = async (parents, args) => {
    return await getData(args);
}
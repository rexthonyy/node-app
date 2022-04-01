const pgQueries = require('../../postgres/kb-queries');

const init = () => {
    return new Promise((resolve, reject) => {
        
        pgQueries.listKnowledgeBases(result => {
            if(result.err){
                return resolve(result.err);
            }
            resolve(result.res);
        });
    });
}

module.exports = () => {
    init()
    .then(result => {
        return result;
    });
    // return {
    //     id: 1,
    //     name: "knowledgebase x",
    //     icon: "icon",
    //     footer: "some",
    //     created_at: "382",
    //     homepage_layout: "best",
    //     category_layout: "chat",
    //     active: true,
    //     updated_at: "382",
    //     front_page: "lss",
    //     position: 21,
    //     ui_color: "blue",
    //     is_archived: false
    // };
}
const pgQueries = require('../../postgres/kb-queries');

let getCategoryLevel = (category_id, level, cb) => {
    pgQueries.listKnowledgeBaseCategoriesById(category_id, result => {
        if(result.res.length == 0) return cb(level);

        level++;
        let category = result.res[0];
        getCategoryLevel(category.parent_id, level, final_level => {
            cb(final_level);
        });
    });
}

module.exports = getCategoryLevel;
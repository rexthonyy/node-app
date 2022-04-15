const pgQueries = require('../../postgres/kb-queries');

const getData = ({ category_id }) => {
    return new Promise((resolve, reject) => {

        pgQueries.listKnowledgeBaseCategoriesById(category_id, result => {
            if(result.err){
                result.err.errorIndex = 38475;
                return reject(result.err);
            }
            if(result.res.length == 0) return reject({ status: 404, message: "Category not found" });

            let cat = result.res[0];

            resolve({
                id: cat.id,
                knowledge_base_id: cat.knowledge_base_id,
                parent_id: cat.parent_id,
                position: cat.position,
                created_at: cat.created_at,
                updated_at: cat.updated_at,
                is_archived: cat.is_archived
            });
        });
    });
}

module.exports = async (parents, args) => {
    return await getData(args);
}
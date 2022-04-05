const pgQueries = require('../../postgres/kb-queries');
const setOrderForKnowledgebases = require('../resolverUtils/setOrderForKnowledgebases');

const getData = ({knowledge_base_ids}) => {
    return new Promise((resolve, reject) => {
        setOrderForKnowledgebases(knowledge_base_ids, () => {
            resolve({
                status: "success",
                message: "Positions updated successfully!"
            });
        });
    });
}

module.exports = async (parent, args) => {
    let result = await getData(args)
    return result;
}
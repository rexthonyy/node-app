const pgQueries = require('../../postgres/kb-queries');

const getData = ({knowledgebaseIds}) => {
    return new Promise((resolve, reject) => {
        console.log(knowledgebaseIds);
        resolve("Positions updated successfully!");
    });
}

module.exports = async (parent, args) => {
    let result = await getData(args)
    return result;
}
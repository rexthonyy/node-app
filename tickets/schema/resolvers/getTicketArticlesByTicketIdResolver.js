const pgQueries = require('../../postgres/ticket-queries');

const getData = ({ticket_id}) => {
    return new Promise((resolve, reject) => {
        pgQueries.getTicketArticlesByTicketId(ticket_id, result => {
            if(result.err){
                return reject(result.err);
            }
            resolve(result.res);
        });
    });
}

module.exports = async (parent, args) => {
    let result = await getData(args)
    return result;
}
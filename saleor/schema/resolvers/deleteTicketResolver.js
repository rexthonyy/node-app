const pgQueries = require('../../postgres/ticket-queries');

const getData = ({ticket_id}) => {
    return new Promise((resolve, reject) => {
        pgQueries.deleteTicketArticleByTicketId([ticket_id], result => {
            if(result.err){
                return reject(result.err);
            }
    
            pgQueries.deleteTicket([ticket_id], result2 => {
                if(result2.err){
                    return result2.err;
                }
    
                resolve({ status: "success", message: "Ticket deleted successfully!"});
            });
        });
    });
}

module.exports = async (parent, args) => {
    return await getData(args);
}
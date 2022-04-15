const updateTicket = require('../resolverUtils/updateTicket');
const updateTicketArticle = require('../resolverUtils/updateTicketArticle');

const getData = ({ticket_id, title, group, state, priority, article}) => {
    return new Promise((resolve, reject) => {
        updateTicket(ticket_id, title, group, state, priority, result => {
            if(result.err){
                return reject("Ticket not found : " + result.err);
            }

            updateTicketArticle(ticket_id, article, result2 => {
                if(result2.err){
                    return reject("Article not found : " + result2.err);
                }
    
                resolve({ status: "success", message: "Ticket updated successfully!"});
            });
        });
    });
}

module.exports = async (parent, args) => {
    return await getData(args);
}
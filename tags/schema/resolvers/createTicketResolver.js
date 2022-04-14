const createTicket = require('../resolverUtils/createTicket');
const createArticle = require('../resolverUtils/createArticle');

const getData = ({title, group, customer, article}) => {
    return new Promise((resolve, reject) => {
        createTicket(title, group, customer, result => {
            if(result.err){
                return reject(result.err);
            }
    
            let ticket = result.res;
            article.ticket_id = ticket.id;

            createArticle(customer, article, result2 => {
                if(result2.err){
                    return reject(result2.err);
                }
    
                let new_article = result2.res;
    
                ticket.article_ids = [new_article.id];
    
                resolve(ticket);
            });
        });
    });
}

module.exports = async (parent, args) => {
    let result = await getData(args)
    return result;
}
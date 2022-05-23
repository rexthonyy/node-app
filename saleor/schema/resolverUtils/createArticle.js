const pgQueries = require('../../postgres/ticket-queries');

module.exports = (customer, article, cb) => {
    
    let values = [
        article.ticket_id,
        10,
        -1,
        customer,
        "",
        "",
        article.subject,
        "",
        null,
        null,
        null,
        "text/plain",
        null,
        article.body,
        article.internal,
        "",
        -1,
        -1,
        -1,
        new Date().toUTCString(),
        new Date().toUTCString()
    ];

    pgQueries.createTicketArticle(null, values, (res_, result) => {
        cb(result);
    });
};
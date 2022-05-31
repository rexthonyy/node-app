const pgQueries = require('../../postgres/ticket-queries');

module.exports = (ticket_id, article, cb) => {
    pgQueries.getTicketArticlesByArticleId(article.id, result => {
        if(result.err || result.res.length == 0 || result.res[0].ticket_id != ticket_id){
            return cb(result);
        }

        let art = result.res[0];

        let values = [
            art.id,
            art.ticket_id,
            art.type_id,
            art.sender_id,
            art.from_,
            art.to_,
            art.cc,
            article.subject,
            art.reply_to,
            art.message_id,
            art.message_id_md5,
            art.in_reply_to,
            art.content_type,
            art.references_,
            article.body,
            article.internal,
            art.preferences,
            art.updated_by_id,
            art.created_by_id,
            art.origin_by_id,
            art.created_at,
            new Date().toUTCString()
        ];

        pgQueries.updateTicketArticle(values, result => {
            cb(result);
        });
    });
};
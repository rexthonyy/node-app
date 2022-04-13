const pgQueries = require('../../postgres/ticket-queries');

module.exports = (title, group, customer, cb) => {
    let values = [
        -1,
        3,
        1,
        -1,
        1,
        title,
        1,
        1,
        "",
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        10,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        new Date().toUTCString(),
        new Date().toUTCString()
    ];

    pgQueries.createTicket(null, values, (res_, result) => {
        cb(result);
    });
};
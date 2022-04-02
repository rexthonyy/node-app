const pgQueries = require('../../postgres/kb-queries');

module.exports = (activity_type, activity_name, metadata, cb) => {
    let values = [
        activity_type,
        activity_name,
        metadata
    ];

    pgQueries.createActivityStream(values, result => {
        cb();
    });
}

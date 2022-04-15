const pgQueries = require('../../postgres/tag-queries');

module.exports = (object, cb) => {
    pgQueries.getTagObjectsByName([object], result => {
        if(result.err){
            console.error(result.err);
            return cb(null);
        }

        if(result.res.length == 0){
            cb(null);
        }else{
            let tag_object_id = result.res[0].id;
            cb(tag_object_id);
        }
    });
};
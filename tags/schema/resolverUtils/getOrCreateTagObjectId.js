const pgQueries = require('../../postgres/tag-queries');

module.exports = (object, cb) => {
    pgQueries.getTagObjectsByName([object], result => {
        if(result.err){
            console.error(result.err);
            return cb(null);
        }

        if(result.res.length == 0){
            pgQueries.createTagObject([
                object,
                new Date().toUTCString(),
                new Date().toUTCString()
            ], result1 => {
                if(result1.err){
                    console.error(result1.err);
                    return cb(null);
                }

                let tag_object_id = result1.res.id;
                cb(tag_object_id);
            });
        }else{
            let tag_object_id = result.res[0].id;
            cb(tag_object_id);
        }
    });
};
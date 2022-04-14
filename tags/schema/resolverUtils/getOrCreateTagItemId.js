const pgQueries = require('../../postgres/tag-queries');

module.exports = (item, cb) => {
    let item_lowercase = item.toLowerCase().trim();
    pgQueries.getTagItemByName([item_lowercase], result => {
        if(result.err){
            console.error(result.err);
            return cb(null);
        }
        // if there are no items that match that tag
        if(result.res.length == 0){
            pgQueries.createTagItem([
                item,
                item_lowercase,
                new Date().toUTCString(),
                new Date().toUTCString()
            ], result1 => {
                if(result1.err){
                    console.error(result1.err);
                    return cb(null);
                }

                let tag_item_id = result1.res.id;

                cb(tag_item_id);
            });
        }else{
            let tag_item_id = result.res[0].id;
            cb(tag_item_id);
        }
    });
};
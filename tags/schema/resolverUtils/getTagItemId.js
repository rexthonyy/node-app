const pgQueries = require('../../postgres/tag-queries');

module.exports = (item, cb) => {
    let item_lowercase = item.toLowerCase().trim();
    pgQueries.getTagItemByName([item_lowercase], result => {
        if(result.err){
            console.error(result.err);
            return cb(null);
        }

        if(result.res.length == 0){
            cb(null);
        }else{
            let tag_item_id = result.res[0].id;
            cb(tag_item_id);
        }
    });
};
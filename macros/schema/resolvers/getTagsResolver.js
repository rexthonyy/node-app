const pgQueries = require('../../postgres/tag-queries');

const getData = ({object}) => {
    return new Promise((resolve, reject) => {
        object = object.trim().toLowerCase();
        pgQueries.getTagObjectsByName([object], result => {
            if(result.err || result.res.length == 0){
                return reject("Object not found: " + result.err);
            }
            let tagObject = result.res[0];

            pgQueries.getTagsByObjectId([tagObject.id], result => {
                if(result.err || result.res.length == 0){
                    return reject("Tag not found: " + result.err);
                }

                let tags_r = [];

                let tags = result.res;
                let num_tags = tags.length;
                let count = -1;

                tags.forEach(tag => {
                    pgQueries.getTagItemById([tag.tag_item_id], result => {
                        if(result.err || result.res.length == 0){
                            checkComplete();
                        }else{
                            let tag_item = result.res[0];
                            tags_r.push(tag_item.name_downcase);
                            checkComplete();
                        }
                    });
                });

                checkComplete();

                function checkComplete(){
                    count++;
                    if(count == num_tags){
                        resolve(tags_r);
                    }
                }
            });
        });
    });
}

module.exports = async (parent, args) => {
    let result = await getData(args)
    return result;
}
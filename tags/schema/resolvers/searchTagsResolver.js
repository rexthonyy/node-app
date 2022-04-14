const pgQueries = require('../../postgres/tag-queries');

const getData = ({object, query}) => {
    return new Promise((resolve, reject) => {
        object = object?object.trim().toLowerCase():"";
        query = query.trim().toLowerCase();

        let found_tags = [];
        let tag_object_ids = tag_items = [];

        pgQueries.getTagObjectsByName([object], result => {
            if(!(result.err || result.res.length == 0)){
                tag_object_ids.push(result.res[0].id);
            }

            pgQueries.searchTagItems(query, result => {
                if(!(result.err || result.res.length == 0)){
                    tag_items = result.res;
                }

                let numTags = tag_items.length;
                let count = -1;

                tag_items.forEach(item => {
                    if(tag_object_ids.length > 0){
                        tag_object_id = tag_object_ids[0];
                        pgQueries.getTagsByObjectIdAndItemId([tag_object_id, item.id], result => {
                            if(!(result.err || result.res.length == 0)){
                                found_tags.push(item);
                            }
                            checkComplete();
                        });
                    }else{
                        found_tags.push(item);
                        checkComplete();
                    }
                });

                checkComplete();

                function checkComplete(){
                    count++;
                    if(count == numTags){
                        let numFoundTags = found_tags.length;
                        count = -1;

                        let tags_r = [];

                        found_tags.forEach(tag => {
                            pgQueries.getTagsByItemId([tag.id], result => {
                                if(!(result.err || result.res.length == 0)){
                                    let object_id = result.res[0].tag_object_id;
                                    pgQueries.getTagObjectById([object_id], result => {
                                        if(!(result.err || result.res.length == 0)){
                                            let obj = result.res[0];
                                            tags_r.push({
                                                item: tag.name_downcase,
                                                object: obj.name
                                            });
                                        }
                                        
                                        checkComplete();
                                    });
                                }else{
                                    checkComplete();
                                }
                            });
                        });

                        checkComplete();

                        function checkComplete(){
                            count++;
                            if(count == numFoundTags){
                                resolve(tags_r);
                            }
                        }
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
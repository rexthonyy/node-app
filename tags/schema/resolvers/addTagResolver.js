const pgQueries = require('../../postgres/tag-queries');
const getOrCreateTagItemId = require('../resolverUtils/getOrCreateTagItemId');
const getOrCreateTagObjectId = require('../resolverUtils/getOrCreateTagObjectId');

const getData = ({item, object}) => {
    return new Promise((resolve, reject) => {
        object = object.trim().toLowerCase();
        getOrCreateTagItemId(item, tag_item_id => {
            getOrCreateTagObjectId(object, tag_object_id => {    
                pgQueries.getTagsByObjectIdAndItemId([
                    tag_object_id,
                    tag_item_id
                ], result => {
                    if(result.err){
                        return reject(result.err);
                    }
    
                    if(result.res.length == 0){
                        pgQueries.createTag([
                            tag_item_id,
                            tag_object_id,
                            1,
                            1,
                            new Date().toUTCString(),
                            new Date().toUTCString()
                        ], result1 => {
                            if(result1.err){
                                return reject(result1.err);
                            }
    
                            return resolve({ status: "success", message: "Tag created successfully!"});
                        });
                    }else{
                        return resolve({ status: "success", message: "Tag created successfully!"});
                    }
                });
            });
        });
    });
}

module.exports = async (parent, args) => {
    return await getData(args);
}
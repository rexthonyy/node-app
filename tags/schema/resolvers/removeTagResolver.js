const pgQueries = require('../../postgres/tag-queries');
const getTagItemId = require('../resolverUtils/getTagItemId');
const getTagObjectId = require('../resolverUtils/getTagObjectId');

const getData = ({item, object}) => {
    return new Promise((resolve, reject) => {
        object = object.trim().toLowerCase();
        getTagItemId(item, tag_item_id => {
            getTagObjectId(object, tag_object_id => {
                
                if(tag_item_id == null || tag_object_id == null){
                    return resolve({ status: "success", message: "Tag removed successfully!" });
                }
    
                pgQueries.deleteTagsByObjectIdAndItemId([
                    tag_item_id,
                    tag_object_id
                ], result => {
                    pgQueries.deleteTagItemById([tag_item_id], result => {
                        return resolve({ status: "success", message: "Tag removed successfully!" });
                    })
                });
            });
        });
    });
}

module.exports = async (parent, args) => {
    return await getData(args);
}
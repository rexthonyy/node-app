let getCategoriesAtLevel = (tree, level, index, cb) => {
    if(level == index){
        tree.forEach(translation => {
            delete translation.subcategories;
        });
        return cb(tree);
    }

    if(tree.length == 0) return cb(tree);

    let next_index = index + 1;

    let next_level_categories = [];

    let level_1_count = -1;
    let num_level_1_items = tree.length;

    tree.forEach(translation => {
        getCategoriesAtLevel(translation.subcategories, level, next_index, level_categories => {
            next_level_categories = next_level_categories.concat(level_categories);
            checkComplete();
        });
    });

    checkComplete();

    function checkComplete(){
        level_1_count++;
        if(level_1_count == num_level_1_items){
            return cb(next_level_categories);
        }
    }
}

module.exports = getCategoriesAtLevel;
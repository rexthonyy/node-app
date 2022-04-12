let getMaxLevels = (tree, level, index, cb) => {
    let num_subcategories = tree.length;
    let count = -1;
    let all_levels = [];

    if(num_subcategories == 0) return cb(index);

    let next_level = level + 1;

    if(next_level > index){
        index = next_level;
    }

    tree.forEach(translation => {
        getMaxLevels(translation.subcategories, next_level, index, max_level => {
            checkComplete(max_level);
        });
    });

    checkComplete(0);

    function checkComplete(a){
        all_levels.push(a);
        count++;
        if(count == num_subcategories){
            cb(Math.max.apply(Math, all_levels));
        }
    }
}

module.exports = getMaxLevels;
const pgQueries = require('../../postgres/kb-queries');
const util = require('../../util');

const getData = ({name, icon, homepage_layout, category_layout, active, front_page, kb_locale_ids}) => {
    return new Promise((resolve, reject) => {
        
        console.log("name: " + name);
        console.log("icon: " + icon);
        console.log("homepage_layout: " + homepage_layout);
        console.log("category_layout: " + category_layout);
        console.log("active: " + active);
        console.log("front_page: " + front_page);
        console.log(kb_locale_ids);
        resolve({status: "testing"});
    });
}

module.exports = async (parents, args) => {
    let result = await getData(args)
    return result;
}
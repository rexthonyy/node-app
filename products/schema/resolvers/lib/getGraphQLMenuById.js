const { formatMetadata } = require("../../../libs/util");
const productQueries = require("../../../postgres/product-queries");
const getGraphQLMenuItemById = require("./getGraphQLMenuItemById");

let getGraphQLMenuById = (id) => {
    return new Promise((resolve, reject) => {
        productQueries.getMenu([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                return reject("Menu not found");
            }

            let menu = result.res[0];
            let items;

            try {
                items = await getItems(menu);
            } catch (err) {
                items = null;
            }

            let res = {
                id: menu.id,
                privateMetadata: formatMetadata(menu.private_metadata),
                metadata: formatMetadata(menu.metadata),
                name: menu.name,
                slug: menu.slug,
                items
            };

            resolve(res);
        });
    });
};


function getItems(menu) {
    return new Promise(async(resolve, reject) => {
        productQueries.getMenuItem([menu.id], "menu_id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            let menuitems_ = result.res;
            const numMenuitems = menuitems_.length;
            let cursor = -1;
            let items = [];

            menuitems_.forEach(async menuitem => {
                try {
                    items.push(await getGraphQLMenuItemById(menuitem.id));
                } catch (err) {}
                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numMenuitems) {
                    resolve(items);
                }
            }
        });
    });
}
module.exports = getGraphQLMenuById;
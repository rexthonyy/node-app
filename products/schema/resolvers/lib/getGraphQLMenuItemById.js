const { formatMetadata } = require("../../../libs/util");
const productQueries = require("../../../postgres/product-queries");
const getGraphQLCategoryById = require("./getGraphQLCategoryById");
const getGraphQLCollectionById = require("./getGraphQLCollectionById");

let getGraphQLMenuItemById = (id) => {
    return new Promise((resolve, reject) => {
        productQueries.getMenuItem([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                return reject("Menu item not found");
            }

            let menuitem = result.res[0];
            let menu;
            let parent;
            let category;
            let collection;
            let page;
            let children;

            try {
                menu = await getMenu(menuitem);
            } catch (err) {
                menu = null;
            }

            try {
                parent = await getGraphQLMenuItemById(menuitem.parent_id);
            } catch (err) {
                parent = null;
            }

            try {
                category = await getGraphQLCategoryById(menuitem.category_id);
            } catch (err) {
                category = null;
            }

            try {
                collection = await getGraphQLCollectionById(menuitem.collection_id);
            } catch (err) {
                collection = null;
            }

            try {
                page = await getPage(menuitem);
            } catch (err) {
                page = null;
            }

            try {
                children = await getChildren(menuitem);
            } catch (err) {
                children = null;
            }

            let res = {
                id: menuitem.id,
                privateMetadata: formatMetadata(menuitem.private_metadata),
                metadata: formatMetadata(menuitem.metadata),
                name: menuitem.name,
                menu,
                parent,
                category,
                collection,
                page,
                level: menuitem.level,
                children,
                url: menuitem.url
            };

            resolve(res);
        });
    });
};

function getMenu(menuitem) {
    return new Promise((resolve, reject) => {
        productQueries.getMenu([menuitem.menu_id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                return reject("Menu not found");
            }

            let menu = result.res[0];
            let items = null;

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

function getPage(menuitem) {
    return new Promise((resolve, reject) => {
        resolve(null);
    });
};

function getChildren(menuitem) {
    return new Promise((resolve, reject) => {
        productQueries.getMenuItem([menuitem.id], "parent_id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            let menuitems_ = result.res;
            const numMenuitems = menuitems_.length;
            cursor = -1;
            let children = [];

            menuitems_.forEach(async menuitem => {
                try {
                    children.push(await getGraphQLMenuItemById(menuitem.id));
                } catch (err) {}
                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numMenuitems) {
                    resolve(children);
                }
            }
        });
    });
};

module.exports = getGraphQLMenuItemById;
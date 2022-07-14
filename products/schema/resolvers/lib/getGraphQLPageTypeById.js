const { formatMetadata } = require("../../../libs/util");
const productQueries = require("../../../postgres/product-queries");

let getGraphQLPageTypeById = (id) => {
    return new Promise((resolve, reject) => {
        productQueries.getPageType([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                return reject("Page type not found");
            }

            let pagetype = result.res[0];
            let hasPages = await getHasPages(pagetype);

            let res = {
                id: pagetype.id,
                privateMetadata: formatMetadata(pagetype.private_metadata),
                metadata: formatMetadata(pagetype.metadata),
                name: pagetype.name,
                slug: pagetype.slug,
                attributes: [],
                hasPages
            };

            resolve(res);
        });
    });
};

function getHasPages(pagetype) {
    return new Promise((resolve, reject) => {
        productQueries.getPage([pagetype.id], "page_type_id=$1", result => {
            if (result.err || result.res.length == 0) return resolve(false);
            resolve(true);
        });
    });
}

module.exports = getGraphQLPageTypeById;
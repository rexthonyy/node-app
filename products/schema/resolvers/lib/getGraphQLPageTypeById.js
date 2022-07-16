const { formatMetadata } = require("../../../libs/util");
const productQueries = require("../../../postgres/product-queries");
const getGraphQLAttributeById = require("./getGraphQLAttributeById");

let getGraphQLPageTypeById = (id) => {
    return new Promise((resolve, reject) => {
        productQueries.getPageType([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                return reject("Page type not found");
            }

            let pagetype = result.res[0];
            let hasPages = await getHasPages(pagetype);
            let attributes;

            try {
                attributes = await getPageTypeAttributes(pagetype);
            } catch (err) {
                attributes = null;
            }

            let res = {
                id: pagetype.id,
                privateMetadata: formatMetadata(pagetype.private_metadata),
                metadata: formatMetadata(pagetype.metadata),
                name: pagetype.name,
                slug: pagetype.slug,
                attributes,
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

function getPageTypeAttributes(pagetype) {
    return new Promise((resolve, reject) => {
        productQueries.getAttributePage([pagetype.id], "page_type_id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            let attributePages = result.res;
            let attributes = [];
            const numAttributePages = attributePages.length;
            let cursor = -1;

            attributePages.forEach(async attributePage => {
                try {
                    attributes.push(await getGraphQLAttributeById(attributePage.attribute_id));
                } catch (err) {}
                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numAttributePages) {
                    resolve(attributes);
                }
            }
            resolve(true);
        });
    });
}

module.exports = getGraphQLPageTypeById;
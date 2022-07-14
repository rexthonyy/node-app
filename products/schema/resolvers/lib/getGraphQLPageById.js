const { formatMetadata } = require("../../../libs/util");
const productQueries = require("../../../postgres/product-queries");
const getGraphQLPageTypeById = require("./getGraphQLPageTypeById");

let getGraphQLPageById = (id) => {
    return new Promise((resolve, reject) => {
        productQueries.getPage([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                return reject("Page not found");
            }

            let page = result.res[0];
            let pageType;

            try {
                pageType = await getGraphQLPageTypeById(page.page_type_id);
            } catch (err) {
                pageType = null;
            }

            let res = {
                id: page.id,
                privateMetadata: formatMetadata(page.private_metadata),
                metadata: formatMetadata(page.metadata),
                seoTitle: page.seo_title,
                seoDescription: page.seo_description,
                title: page.title,
                content: page.content,
                publishedAt: page.publication_date,
                isPublished: page.is_published,
                slug: page.slug,
                pageType,
                created: page.created,
                attributes: [],
                publicationDate: page.publication_date,
                contentJson: page.content,
            };

            resolve(res);
        });
    });
};

module.exports = getGraphQLPageById;
const { formatMetadata } = require("../../../libs/util");
const productQueries = require("../../../postgres/product-queries");
const getGraphQLAttributeById = require("./getGraphQLAttributeById");
const getGraphQLAttributeValueById = require("./getGraphQLAttributeValueById");
const getGraphQLPageTypeById = require("./getGraphQLPageTypeById");

let getGraphQLPageById = (id) => {
    return new Promise((resolve, reject) => {
        productQueries.getPage([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                return reject("Page not found");
            }

            let page = result.res[0];
            let pageType;
            let attributes;

            try {
                pageType = await getGraphQLPageTypeById(page.page_type_id);
            } catch (err) {
                pageType = null;
            }

            try {
                attributes = await getSelectedAttributes(page);
            } catch (err) {
                attributes = null;
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
                attributes,
                publicationDate: page.publication_date,
                contentJson: page.content,
            };

            resolve(res);
        });
    });
};

function getSelectedAttributes(page) {
    return new Promise((resolve, reject) => {
        productQueries.getPageType([page.page_type_id], "id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("page type not found");
            let pageType = result.res[0];
            productQueries.getAttributePage([pageType.id], "page_type_id=$1", result => {
                if (result.err) return reject(JSON.stringify(result.err));
                let pageAttributes = result.res;
                const numPageAttributes = pageAttributes.length;
                let cursor = -1;
                let graphQLSelectedAttributes = [];

                pageAttributes.forEach(async pageAttribute => {
                    try {
                        graphQLSelectedAttributes.push(await getSelectedAttribute(pageAttribute));
                    } catch (err) {}
                    checkComplete();
                });

                checkComplete();

                function checkComplete() {
                    cursor++;
                    if (cursor == numPageAttributes) {
                        resolve(graphQLSelectedAttributes);
                    }
                }
            });
        })
    });
}

function getSelectedAttribute(pageAttribute) {
    return new Promise(async(resolve, reject) => {
        let attributeId = pageAttribute.attribute_id;
        productQueries.getAttribute([attributeId], "id=$1", async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Attribute not found");
            let graphQLAttribute;
            let graphQLValues;
            try {
                graphQLAttribute = await getGraphQLAttributeById(attributeId);
                graphQLValues = await getValues(attributeId);

                resolve({
                    attribute: graphQLAttribute,
                    values: graphQLValues
                });
            } catch (err) {
                return resolve(null);
            }
        });
    });
}

function getValues(attributeId) {
    return new Promise((resolve, reject) => {
        productQueries.getAttributeValue([attributeId], "attribute_id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject(null);
            let attributeValues = result.res;
            const numAttributeValues = attributeValues.length;
            let cursor = -1;
            let graphQLAttributeValues = [];

            attributeValues.forEach(async attributeValue => {
                graphQLAttributeValues.push(await getGraphQLAttributeValueById(attributeValue.id));
                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numAttributeValues) {
                    resolve(graphQLAttributeValues);
                }
            }
        });
    });
}

module.exports = getGraphQLPageById;
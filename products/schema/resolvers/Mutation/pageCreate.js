const {
    checkAuthorization,
    getGraphQLProductById,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLPageById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID", null, null, null));

        let accessPermissions = ["MANAGE_PAGES"];

        if (userHasAccess(authUser.userPermissions, accessPermissions) || userPermissionGroupHasAccess(authUser.permissionGroups, accessPermissions)) {
            resolve(await pageCreate(args));
        } else {
            resolve(getGraphQLOutput("No access", "You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_PAGES", "INVALID", null, null, null));
        }
    });
}

function getGraphQLOutput(field, message, code, attributes, values, page) {
    return {
        errors: [{
            field,
            message,
            code,
            attributes,
            values
        }],
        pageErrors: [{
            field,
            message,
            code,
            attributes,
            values
        }],
        page
    }
}

function pageCreate(args) {
    return new Promise(resolve => {
        let pageTypeId = args.input.pageType;
        let slug = args.input.slug;

        productQueries.getPageType([pageTypeId], "id=$1", async result => {
            if (result.err) return resolve(getGraphQLOutput("getPageType", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
            if (result.res.length == 0) return resolve(getGraphQLOutput("getPageType", "Page type not found", "NOT_FOUND", null, null, null));
            let pageType = result.res[0];

            productQueries.getPage([slug], "slug=$1", async result => {
                if (result.err) return resolve(getGraphQLOutput("getPage", JSON.stringify(result.err), "GRAPHQL_ERROR", null, null, null));
                if (result.res.length > 0) return resolve(getGraphQLOutput("getPage", "slug already being used", "INVALID", null, null, null));;

                try {
                    let page = await createPage(args);
                    await addPageAttributes(page, args.input.attributes ? args.input.attributes : null);
                    let graphQLPage = await getGraphQLPageById(page.id);
                    resolve({
                        errors: [],
                        pageErrors: [],
                        page: graphQLPage
                    });
                } catch (err) {
                    return resolve(getGraphQLOutput("page", err, "GRAPHQL_ERROR", null, null, null));
                }
            });
        });
    });
}

function createPage(args) {
    return new Promise((resolve, reject) => {
        let slug = args.input.slug;
        let title = args.input.title;
        let content = args.input.content;
        let isPublished = args.input.isPublished;
        let publishedAt = args.input.publishedAt ? args.input.publishedAt : args.input.publicationDate;
        let seo = args.input.seo;
        let seo_description = null;
        let seo_title = null;
        if (seo) {
            seo_description = seo.description;
            seo_title = seo.title;
        }
        let pageTypeId = args.input.pageType;
        let now = new Date().toUTCString();

        let values = [
            slug,
            title,
            content,
            now,
            isPublished,
            publishedAt,
            seo_description,
            seo_title,
            JSON.stringify({}),
            JSON.stringify({}),
            pageTypeId
        ];

        productQueries.createPage(values, result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Failed to create page");
            let page = result.res[0];
            resolve(page);
        });
    });
}

function addPageAttributes(page, attributes) {
    return new Promise(resolve => {
        if (attributes == null) return resolve();
        const numAttributes = attributes.length;
        let cursor = -1;

        attributes.forEach(async attr => {
            try {
                await addAttribute(page, attr);
            } catch (err) {}
            checkComplete();
        });

        checkComplete();

        function checkComplete() {
            cursor++;
            if (cursor == numAttributes) {
                resolve();
            }
        }
    });
}

function addAttribute(page, attr) {
    return new Promise(async(resolve, reject) => {
        if (attr.values == null) return reject();

        productQueries.getAttributePage([attr.id, page.page_type_id], "attribute_id=$1 AND page_type_id=$2", result => {
            if (result.err) return reject();
            if (result.res.length == 0) return reject();
            let attributePage = result.res[0];

            const numValues = attr.values.length;
            let cursor = -1;

            attr.values.forEach(async value => {
                try {
                    let attributeValue = await resolveAttributeValue(attr, value);
                    let assignedPageAttribute = await resolveAssignedPageAttribute(page, attributePage.id);
                    let assignedProductAttributeValue = await resolveAssignedPageAttributeValue(assignedPageAttribute.id, attributeValue.id);
                } catch (err) {
                    console.log(err);
                }
                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numValues) {
                    resolve();
                }
            }
        });
    });
}

function resolveAttributeValue(attr, value) {
    return new Promise((resolve, reject) => {
        productQueries.getAttributeValue([attr.id, value], "attribute_id=$1 AND (slug=$2 OR value=$2)", async result => {
            if (result.err) return reject();
            let attributeValue;
            if (result.res.length == 0) {
                try {
                    attributeValue = await createAttributeValue(attr, value);
                } catch (err) {
                    reject(err);
                }
            } else {
                attributeValue = result.res[0];
            }

            resolve(attributeValue);
        });
    });
}

function createAttributeValue(attr, value) {
    return new Promise((resolve, reject) => {
        let attributeId = attr.id;
        let file = attr.file;
        let contentType = attr.contentType;
        let references = attr.references;
        let richText = attr.richText;
        let boolean = attr.boolean;
        let date = attr.date;
        let dateTime = attr.dateTime;

        let input = [
            value,
            attributeId,
            value,
            0,
            value,
            contentType,
            file,
            richText,
            boolean,
            dateTime,
            null,
            null
        ];

        productQueries.createAttributeValue(input, async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Failed to create attribute value");
            resolve(result.res[0]);
        });
    });
}

function resolveAssignedPageAttribute(pageId, attributePageId) {
    return new Promise((resolve, reject) => {
        productQueries.getAssignedPageAttribute([pageId, attributePageId], "page_id=$1 AND assignment_id=$2", async result => {
            if (result.err) return reject();
            let assignedPageAttribute;
            if (result.res.length == 0) {
                assignedPageAttribute = await createAssignedPageAttribute(pageId, attributePageId);
            } else {
                assignedPageAttribute = result.res[0];
            }
            resolve(assignedPageAttribute);
        });
    });
}

function createAssignedPageAttribute(pageId, attributePageId) {
    return new Promise((resolve, reject) => {
        productQueries.createAssignedPageAttribute([attributePageId, pageId], async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Failed to create assigned page attribute");
            resolve(result.res[0]);
        });
    });
}

function resolveAssignedPageAttributeValue(assignedPageAttributeId, attributeValueId) {
    return new Promise((resolve, reject) => {
        productQueries.getAssignedProductAttributeValue([assignedPageAttributeId, attributeValueId], "assignment_id=$1 AND value_id=$2", async result => {
            if (result.err) return reject();
            let assignedPageAttributeValue;
            if (result.res.length == 0) {
                assignedPageAttributeValue = await createAssignedPageAttributeValue(assignedPageAttributeId, attributeValueId);
            } else {
                assignedPageAttributeValue = result.res[0];
            }
            resolve(assignedPageAttributeValue);
        });
    });
}

function createAssignedPageAttributeValue(assignedPageAttributeId, attributeValueId) {
    return new Promise((resolve, reject) => {
        productQueries.createAssignedPageAttributeValue([0, assignedPageAttributeId, attributeValueId], async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Failed to create assigned page attribute value");
            resolve(result.res[0]);
        });
    });
}
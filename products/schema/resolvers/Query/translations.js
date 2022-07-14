const {
    checkAuthorization,
    userPermissionGroupHasAccess,
    userHasAccess,
    getGraphQLAttributeById,
    getGraphQLCategoryById,
    getGraphQLCollectionById,
    getGraphQLMenuItemById,
    getGraphQLPageById,
    getGraphQLProductById,
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");
const getGraphQLAttributeValueById = require('../lib/getGraphQLAttributeValueById');

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return reject(message);

        let permissions = ["MANAGE_TRANSLATIONS"];

        if (userHasAccess(authUser.userPermissions, permissions) || userPermissionGroupHasAccess(authUser.permissionGroups, permissions)) {
            resolve(translations(args));
        } else {
            reject("You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_TRANSLATIONS");
        }
    });
}

function translations(args) {
    return new Promise(async(resolve, reject) => {
        try {
            let edges = await getAllTranslations(args.kind);
            resolve({
                pageInfo: {
                    hasNextPage: false,
                    hasPreviousPage: false,
                    startCursor: "",
                    endCursor: ""
                },
                edges,
                totalCount: edges.length
            });
        } catch (err) {
            reject(err);
        }
    });
}

function getAllTranslations(kind) {
    return new Promise(async(resolve, reject) => {
        switch (kind) {
            case "ATTRIBUTE":
                try {
                    resolve(await getAllAttributeTranslations());
                } catch (err) {
                    reject(err);
                }
                break;

            case "ATTRIBUTE_VALUE":
                try {
                    resolve(await getAllAttributeValueTranslations());
                } catch (err) {
                    reject(err);
                }
                break;

            case "CATEGORY":
                try {
                    resolve(await getAllCategoryTranslations());
                } catch (err) {
                    reject(err);
                }
                break;

            case "COLLECTION":
                try {
                    resolve(await getAllCollectionTranslations());
                } catch (err) {
                    reject(err);
                }
                break;

            case "MENU_ITEM":
                try {
                    resolve(await getAllMenuItemTranslations());
                } catch (err) {
                    reject(err);
                }
                break;

            case "PAGE":
                try {
                    resolve(await getAllPageTranslations());
                } catch (err) {
                    reject(err);
                }
                break;

            case "PRODUCT":
                try {
                    resolve(await getAllProductTranslations());
                } catch (err) {
                    reject(err);
                }
                break;

            case "SALE":
                try {
                    resolve(await getAllSaleTranslations());
                } catch (err) {
                    reject(err);
                }
                break;

            case "SHIPPING_METHOD":
                try {
                    resolve(await getAllShippingMethodTranslations());
                } catch (err) {
                    reject(err);
                }
                break;

            case "VARIANT":
                try {
                    resolve(await getAllVariantTranslations());
                } catch (err) {
                    reject(err);
                }
                break;

            case "VOUCHER":
                try {
                    resolve(await getAllVoucherTranslations());
                } catch (err) {
                    reject(err);
                }
                break;
        }
    });
}

function getAllAttributeTranslations() {
    return new Promise((resolve, reject) => {
        productQueries.getAttributeTranslation([-1], "id <> $1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            let translations_ = result.res;

            const numTranslations = translations_.length;
            let cursor = -1;
            let edges = [];

            translations_.forEach(async translation => {
                try {
                    let attribute = await getGraphQLAttributeById(translation.attribute_id);
                    let node = {
                        id: translation.attribute_id,
                        name: translation.name,
                        attribute
                    }
                    edges.push({
                        cursor: "",
                        node
                    });
                } catch (err) {
                    console.log(err);
                }
                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numTranslations) {
                    resolve(edges);
                }
            }
        });
    });
}

function getAllAttributeValueTranslations() {
    return new Promise((resolve, reject) => {
        productQueries.getAttributeValueTranslation([-1], "id <> $1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            let translations_ = result.res;

            const numTranslations = translations_.length;
            let cursor = -1;
            let edges = [];

            translations_.forEach(async translation => {
                try {
                    let attributeValue = await getGraphQLAttributeValueById(translation.attribute_value_id);
                    let node = {
                        id: translation.attribute_value_id,
                        name: translation.name,
                        richText: translation.rich_text,
                        attributeValue
                    };
                    edges.push({
                        cursor: "",
                        node
                    });
                } catch (err) {
                    console.log(err);
                }

                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numTranslations) {
                    resolve(edges);
                }
            }
        });
    });
}

function getAllCategoryTranslations() {
    return new Promise((resolve, reject) => {
        productQueries.getCategoryTranslation([-1], "id <> $1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            let translations_ = result.res;

            const numTranslations = translations_.length;
            let cursor = -1;
            let edges = [];

            translations_.forEach(async translation => {
                try {
                    let category = await getGraphQLCategoryById(translation.category_id);
                    let node = {
                        id: translation.category_id,
                        seoTitle: translation.seo_title,
                        seoDescription: translation.seo_description,
                        name: translation.name,
                        description: translation.description,
                        descriptionJson: translation.description,
                        category
                    };
                    edges.push({
                        cursor: "",
                        node
                    });
                } catch (err) {
                    console.log(err);
                }

                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numTranslations) {
                    resolve(edges);
                }
            }
        });
    });
}

function getAllCollectionTranslations() {
    return new Promise((resolve, reject) => {
        productQueries.getCollectionTranslation([-1], "id <> $1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            let translations_ = result.res;

            const numTranslations = translations_.length;
            let cursor = -1;
            let edges = [];

            translations_.forEach(async translation => {
                try {
                    let collection = await getGraphQLCollectionById(translation.collection_id);
                    let node = {
                        id: translation.collection_id,
                        seoTitle: translation.seo_title,
                        seoDescription: translation.seo_description,
                        name: translation.name,
                        description: translation.description,
                        descriptionJson: translation.description,
                        collection
                    };
                    edges.push({
                        cursor: "",
                        node
                    });
                } catch (err) {
                    console.log(err);
                }

                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numTranslations) {
                    resolve(edges);
                }
            }
        });
    });
}

function getAllMenuItemTranslations() {
    return new Promise((resolve, reject) => {
        productQueries.getMenuItemTranslation([-1], "id <> $1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            let translations_ = result.res;

            const numTranslations = translations_.length;
            let cursor = -1;
            let edges = [];

            translations_.forEach(async translation => {
                try {
                    let menuItem = await getGraphQLMenuItemById(translation.menu_item_id);
                    let node = {
                        id: translation.menu_item_id,
                        name: translation.name,
                        menuItem
                    };
                    edges.push({
                        cursor: "",
                        node
                    });
                } catch (err) {
                    console.log(err);
                }

                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numTranslations) {
                    resolve(edges);
                }
            }
        });
    });
}

function getAllPageTranslations() {
    return new Promise((resolve, reject) => {
        productQueries.getPageTranslation([-1], "id <> $1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            let translations_ = result.res;

            const numTranslations = translations_.length;
            let cursor = -1;
            let edges = [];

            translations_.forEach(async translation => {
                let page;
                let attributeValues;
                try {
                    page = await getGraphQLPageById(translation.page_id);
                } catch (err) {
                    page = null
                }
                try {
                    attributeValues = await getAttributeValuesByPageId(translation.page_id);
                } catch (err) {
                    attributeValues = null
                }

                try {

                    let node = {
                        id: translation.page_id,
                        seoTitle: translation.seo_title,
                        seoDescription: translation.seo_description,
                        title: translation.title,
                        content: translation.content,
                        attributeValues,
                        contentJson: translation.content,
                        page,
                    };
                    edges.push({
                        cursor: "",
                        node
                    });
                } catch (err) {
                    console.log(err);
                }

                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numTranslations) {
                    resolve(edges);
                }
            }
        });
    });
}

function getAttributeValuesByPageId(pageId) {
    return new Promise((resolve, reject) => {
        productQueries.getAttributeValue([pageId], "reference_page_id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            let attributeValues_ = result.res;
            const numAttributeValues = attributeValues_.length;
            let cursor = -1;
            let attributeValues = [];

            attributeValues_.forEach(async av => {
                let attributeValue;
                try {
                    attributeValue = await getGraphQLAttributeValueById(av.id);
                } catch (err) {
                    attributeValue = null;
                }

                attributeValues.push({
                    id: av.id,
                    name: av.name,
                    richText: av.rich_text,
                    attributeValue
                });
                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numAttributeValues) {
                    resolve(attributeValues);
                }
            }
        });
    });
}

function getAllProductTranslations() {
    return new Promise((resolve, reject) => {
        productQueries.getProductTranslation([-1], "id <> $1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            let translations_ = result.res;

            const numTranslations = translations_.length;
            let cursor = -1;
            let edges = [];

            translations_.forEach(async translation => {
                let product;
                let attributeValues;
                try {
                    product = await getGraphQLProductById(translation.product_id);
                } catch (err) {
                    product = null;
                }
                try {
                    attributeValues = await getAttributeValuesByProductId(translation.product_id);
                } catch (err) {
                    attributeValues = null;
                }

                try {
                    let node = {
                        id: translation.product_id,
                        seoTitle: translation.seo_title,
                        seoDescription: translation.seo_description,
                        name: translation.name,
                        description: translation.description,
                        attributeValues,
                        descriptionJson: translation.description,
                        product
                    };
                    edges.push({
                        cursor: "",
                        node
                    });
                } catch (err) {
                    console.log(err);
                }

                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numTranslations) {
                    resolve(edges);
                }
            }
        });
    });
}

function getAttributeValuesByProductId(productId) {
    return new Promise((resolve, reject) => {
        productQueries.getAttributeValue([productId], "reference_product_id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            let attributeValues_ = result.res;
            const numAttributeValues = attributeValues_.length;
            let cursor = -1;
            let attributeValues = [];

            attributeValues_.forEach(async av => {
                let attributeValue;
                try {
                    attributeValue = await getGraphQLAttributeValueById(av.id);
                } catch (err) {
                    attributeValue = null;
                }

                attributeValues.push({
                    id: av.id,
                    name: av.name,
                    richText: av.rich_text,
                    attributeValue
                });
                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numAttributeValues) {
                    resolve(attributeValues);
                }
            }
        });
    });
}
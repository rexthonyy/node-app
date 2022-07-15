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
    getGraphQLSaleById,
    getGraphQLShippingMethodTypeById,
    getGraphQLProductVariantById,
    getGraphQLVoucherById,
    getGraphQLAttributeValueById,
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return reject(message);

        let permissions = ["MANAGE_TRANSLATIONS"];

        if (userHasAccess(authUser.userPermissions, permissions) || userPermissionGroupHasAccess(authUser.permissionGroups, permissions)) {
            resolve(getTranslation(args));
        } else {
            reject("You do not have the necessary permissions required to perform this operation. Permissions required MANAGE_TRANSLATIONS");
        }
    });
}

function getTranslation(args) {
    return new Promise(async(resolve, reject) => {
        switch (args.kind) {
            case "ATTRIBUTE":
                try {
                    resolve(await getAttributeTranslation(args.id));
                } catch (err) {
                    reject(err);
                }
                break;

            case "ATTRIBUTE_VALUE":
                try {
                    resolve(await getAttributeValueTranslations(args.id));
                } catch (err) {
                    reject(err);
                }
                break;

            case "CATEGORY":
                try {
                    resolve(await getCategoryTranslations(args.id));
                } catch (err) {
                    reject(err);
                }
                break;

            case "COLLECTION":
                try {
                    resolve(await getCollectionTranslations(args.id));
                } catch (err) {
                    reject(err);
                }
                break;

            case "MENU_ITEM":
                try {
                    resolve(await getMenuItemTranslations(args.id));
                } catch (err) {
                    reject(err);
                }
                break;

            case "PAGE":
                try {
                    resolve(await getPageTranslations(args.id));
                } catch (err) {
                    reject(err);
                }
                break;

            case "PRODUCT":
                try {
                    resolve(await getProductTranslations(args.id));
                } catch (err) {
                    reject(err);
                }
                break;

            case "SALE":
                try {
                    resolve(await getSaleTranslations(args.id));
                } catch (err) {
                    reject(err);
                }
                break;

            case "SHIPPING_METHOD":
                try {
                    resolve(await getShippingMethodTranslations(args.id));
                } catch (err) {
                    reject(err);
                }
                break;

            case "VARIANT":
                try {
                    resolve(await getVariantTranslations(args.id));
                } catch (err) {
                    reject(err);
                }
                break;

            case "VOUCHER":
                try {
                    resolve(await getVoucherTranslations(args.id));
                } catch (err) {
                    reject(err);
                }
                break;
        }
    });
}

function getAttributeTranslation(id) {
    return new Promise((resolve, reject) => {
        productQueries.getAttributeTranslation([id], "id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Attribute translation not found");
            let translation = result.res[0];

            try {
                let attribute = await getGraphQLAttributeById(translation.attribute_id);
                resolve({
                    id: translation.attribute_id,
                    name: translation.name,
                    attribute,
                    __typename: "AttributeTranslatableContent"
                });
            } catch (err) {
                reject(err);
            }
        });
    });
}

function getAttributeValueTranslations(id) {
    return new Promise((resolve, reject) => {
        productQueries.getAttributeValueTranslation([id], "id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Attribute value translation not found");
            let translation = result.res[0];

            try {
                let attributeValue = await getGraphQLAttributeValueById(translation.attribute_value_id);
                resolve({
                    id: translation.attribute_value_id,
                    name: translation.name,
                    richText: translation.rich_text,
                    attributeValue,
                    __typename: "AttributeValueTranslatableContent"
                });
            } catch (err) {
                reject(err);
            }
        });
    });
}

function getCategoryTranslations(id) {
    return new Promise((resolve, reject) => {
        productQueries.getCategoryTranslation([id], "id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Category translation not found");
            let translation = result.res[0];
            try {
                let category = await getGraphQLCategoryById(translation.category_id);
                resolve({
                    id: translation.category_id,
                    seoTitle: translation.seo_title,
                    seoDescription: translation.seo_description,
                    name: translation.name,
                    description: translation.description,
                    descriptionJson: translation.description,
                    category,
                    __typename: "CategoryTranslatableContent"
                });
            } catch (err) {
                reject(err);
            }
        });
    });
}

function getCollectionTranslations(id) {
    return new Promise((resolve, reject) => {
        productQueries.getCollectionTranslation([id], "id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Collection translation not found");
            let translation = result.res[0];
            try {
                let collection = await getGraphQLCollectionById(translation.collection_id);
                resolve({
                    id: translation.collection_id,
                    seoTitle: translation.seo_title,
                    seoDescription: translation.seo_description,
                    name: translation.name,
                    description: translation.description,
                    descriptionJson: translation.description,
                    collection,
                    __typename: "CollectionTranslatableContent"
                });
            } catch (err) {
                reject(err);
            }
        });
    });
}

function getMenuItemTranslations(id) {
    return new Promise((resolve, reject) => {
        productQueries.getMenuItemTranslation([id], "id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("MenuItem translation not found");
            let translation = result.res[0];
            try {
                let menuItem = await getGraphQLMenuItemById(translation.menu_item_id);
                resolve({
                    id: translation.menu_item_id,
                    name: translation.name,
                    menuItem,
                    __typename: "MenuItemTranslatableContent"
                });
            } catch (err) {
                reject(err);
            }
        });
    });
}

function getPageTranslations(id) {
    return new Promise((resolve, reject) => {
        productQueries.getPageTranslation([id], "id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Page translation not found");
            let translation = result.res[0];
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

                resolve({
                    id: translation.page_id,
                    seoTitle: translation.seo_title,
                    seoDescription: translation.seo_description,
                    title: translation.title,
                    content: translation.content,
                    attributeValues,
                    contentJson: translation.content,
                    page,
                    __typename: "PageTranslatableContent",
                });
            } catch (err) {
                reject(err);
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

function getProductTranslations(id) {
    return new Promise((resolve, reject) => {
        productQueries.getProductTranslation([id], "id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Product translation not found");
            let translation = result.res[0];
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
                resolve({
                    id: translation.product_id,
                    seoTitle: translation.seo_title,
                    seoDescription: translation.seo_description,
                    name: translation.name,
                    description: translation.description,
                    attributeValues,
                    descriptionJson: translation.description,
                    product,
                    __typename: "ProductTranslatableContent",
                });
            } catch (err) {
                reject(err);
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


function getSaleTranslations(id) {
    return new Promise((resolve, reject) => {
        productQueries.getDiscountSaleTranslation([id], "id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Sale translation not found");
            let translation = result.res[0];
            let sale;
            try {
                sale = await getGraphQLSaleById(translation.sale_id);
            } catch (err) {
                sale = null;
            }

            try {
                resolve({
                    id: translation.sale_id,
                    name: translation.name,
                    sale,
                    __typename: "SaleTranslatableContent"
                });
            } catch (err) {
                reject(err);
            }
        });
    });
}

function getShippingMethodTranslations(id) {
    return new Promise((resolve, reject) => {
        productQueries.getShippingMethodTranslation([id], "id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Shipping method translation not found");
            let translation = result.res[0];
            let shippingMethod;
            try {
                shippingMethod = await getGraphQLShippingMethodTypeById(translation.shipping_method_id);
            } catch (err) {
                shippingMethod = null;
            }

            try {
                resolve({
                    id: translation.shipping_method_id,
                    name: translation.name,
                    description: translation.description,
                    shippingMethod,
                    __typename: "ShippingMethodTranslatableContent"
                });
            } catch (err) {
                reject(err);
            }
        });
    });
}

function getVariantTranslations(id) {
    return new Promise((resolve, reject) => {
        productQueries.getProductVariantTranslation([-1], "id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Variant translation not found");
            let translation = result.res[0];
            let productVariant;
            let attributeValues;
            try {
                productVariant = await getGraphQLProductVariantById(translation.product_variant_id);
            } catch (err) {
                productVariant = null;
            }
            try {
                attributeValues = await getAttributeValuesByVariantId(translation.product_variant_id);
            } catch (err) {
                attributeValues = null;
            }

            try {
                resolve({
                    id: translation.product_variant_id,
                    name: translation.name,
                    attributeValues,
                    productVariant,
                    __typename: "ProductVariantTranslatableContent"
                });
            } catch (err) {
                reject(err);
            }
        });
    });
}

function getAttributeValuesByVariantId(productVariantId) {
    return new Promise((resolve, reject) => {
        productQueries.getAssignedVariantAttribute([productVariantId], "variant_id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));

            let assignedVariantAttributes_ = result.res;
            let attributeValues = [];
            const numAssignedVariantAttributes = assignedVariantAttributes_.length;
            let cursor = -1;

            assignedVariantAttributes_.forEach(async variantAttribute => {
                try {
                    attributeValues.concat(await getAttributeValuesFromAssignedAttributeValues(variantAttribute));
                } catch (err) {}
                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numAssignedVariantAttributes) {
                    resolve(attributeValues);
                }
            }
        });
    });
}


function getAttributeValuesFromAssignedAttributeValues(variantAttribute) {
    return new Promise((resolve, reject) => {
        productQueries.getAssignedVariantAttributeValue([variantAttribute.id], "assignment_id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            let assignedVariantAttributeValues_ = result.res;
            let attributeValues = [];
            const numAssignedVariantAttributes = assignedVariantAttributeValues_.length;
            let cursor = -1;

            assignedVariantAttributeValues_.forEach(async variantAttributes => {
                try {
                    attributeValues.push(await getAttributeValueById(variantAttributes.value_id));
                } catch (err) {}
                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numAssignedVariantAttributes) {
                    resolve(attributeValues);
                }
            }
        });
    });
}


function getAttributeValueById(valueId) {
    return new Promise((resolve, reject) => {
        productQueries.getAttributeValue([valueId], "id=$1", async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Attribute value not found");
            let av = result.res[0];
            let attributeValue;
            try {
                attributeValue = await getGraphQLAttributeValueById(av.id);
            } catch (err) {
                attributeValue = null;
            }

            resolve({
                id: av.id,
                name: av.name,
                richText: av.rich_text,
                attributeValue
            });
        });
    });
}

function getVoucherTranslations(id) {
    return new Promise((resolve, reject) => {
        productQueries.getDiscountVoucherTranslation([id], "id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Discount voucher translation not found");
            let translation = result.res[0];
            let voucher;
            try {
                voucher = await getGraphQLVoucherById(translation.voucher_id);
            } catch (err) {
                voucher = null;
            }

            try {
                resolve({
                    id: translation.voucher_id,
                    name: translation.name,
                    voucher,
                    __typename: "VoucherTranslatableContent"
                });
            } catch (err) {
                reject(err);
            }
        });
    });
}
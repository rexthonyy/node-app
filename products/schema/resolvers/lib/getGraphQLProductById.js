const { formatMetadata } = require("../../../libs/util");
const productQueries = require("../../../postgres/product-queries");
const getGraphQLProductTypeById = require('./getGraphQLProductTypeById');
const getGraphQLCategoryById = require('./getGraphQLCategoryById');
const getGraphQLSelectedAttributesByProductId = require('./getGraphQLSelectedAttributesByProductId');
const getGraphQLCollectionById = require("./getGraphQLCollectionById");
const getGraphQLProductVariantById = require("./getGraphQLProductVariantById");
const getGraphQLAttributeById = require("./getGraphQLAttributeById");

let getGraphQLProductById = (productId) => {
    return new Promise((resolve, reject) => {
        productQueries.getProduct([productId], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                return reject("Product not found");
            }

            let product = result.res[0];
            let productType;
            let category;
            let defaultVariant;
            let channelListings;
            let attributes;
            let collections;
            let defaultWeightUnit;

            try {
                productType = await getGraphQLProductTypeById(product.product_type_id);
            } catch (err) {
                productType = null;
            }
            try {
                category = await getGraphQLCategoryById(product.category_id);
            } catch (err) {
                category = null;
            }
            try {
                defaultVariant = await getGraphQLProductVariantById(product.default_variant_id);
            } catch (err) {
                defaultVariant = null;
            }
            try {
                attributes = await getSelectedAttributesByProductId(product.id);
            } catch (err) {
                attributes = null;
            }
            try {
                collections = await getCollectionsByProductId(product.id);
            } catch (err) {
                collections = [];
            }
            try {
                defaultWeightUnit = await getDefaultWeightUnit();
            } catch (err) {
                defaultWeightUnit = [];
            }

            try {
                channelListings = null;
            } catch (err) {
                channelListings = null;
            }

            let res = {
                id: product.id,
                privateMetadata: formatMetadata(product.private_metadata),
                metadata: formatMetadata(product.metadata),
                seoTitle: product.seo_title,
                seoDescription: product.seo_description,
                name: product.name,
                description: product.description,
                productType,
                slug: product.slug,
                category,
                created: product.created,
                updatedAt: product.updated_at,
                chargeTaxes: product.charge_taxes,
                weight: {
                    unit: defaultWeightUnit,
                    value: product.weight
                },
                defaultVariant,
                rating: product.rating,
                channel: "default-channel",
                taxType: null,
                attributes,
                channelListings,
                variants: null,
                media: null,
                collections,
                availableForPurchaseAt: null,
                isAvailableForPurchase: true,
                descriptionJson: {},
                imageById: null,
                images: null,
                availableForPurchase: null
            };

            resolve(res);
        });
    });
};

function getCollectionsByProductId(productId) {
    return new Promise((resolve, reject) => {
        productQueries.getCollectionProduct([productId], "product_id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            let collectionProducts = result.res;
            const numCollectionProducts = collectionProducts.length;
            let cursor = -1;
            let graphQLCollections = [];

            collectionProducts.forEach(async collectionProduct => {
                try {
                    graphQLCollections.push(await getGraphQLCollectionById(collectionProduct.collection_id));
                } catch (err) {}
                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numCollectionProducts) {
                    resolve(graphQLCollections);
                }
            }
        })
    });
}

function getSelectedAttributesByProductId(productId) {
    return new Promise((resolve, reject) => {
        productQueries.getAssignedProductAttribute([productId], "product_id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            let assignedProductAttributes = result.res;
            const numAssignedProductAttributes = assignedProductAttributes.length;
            let cursor = -1;
            let graphQLSelectedAttributes = [];

            assignedProductAttributes.forEach(async assignedProductAttribute => {
                try {
                    graphQLSelectedAttributes.push(await getSelectedAttribute(productId, assignedProductAttribute));
                } catch (err) {}
                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numAssignedProductAttributes) {
                    resolve(graphQLSelectedAttributes);
                }
            }
        })
    });
}


function getSelectedAttribute(productId, assignedProductAttribute) {
    return new Promise(async(resolve, reject) => {
        let assignmentId = assignedProductAttribute.assignment_id;
        productQueries.getAttributeProduct([assignmentId], "id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject();
            let attributeProduct = result.res[0];
            let attributeId = attributeProduct.attribute_id;
            productQueries.getAttribute([attributeId], "id=$1", async result => {
                if (result.err) return reject(JSON.stringify(result.err));
                if (result.res.length == 0) return reject();
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



function getDefaultWeightUnit() {
    return new Promise((resolve, reject) => {
        resolve("kg");;
    });
}
module.exports = getGraphQLProductById;
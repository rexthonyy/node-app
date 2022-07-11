const { formatMetadata } = require("../../../libs/util");
const productQueries = require("../../../postgres/product-queries");
const getGraphQLProductVariantChannelListingsByVariantId = require('./getGraphQLProductVariantChannelListingsByVariantId');
const getGraphQLVariantPricingInfoByVariantId = require('./getGraphQLVariantPricingInfoByVariantId');
const getGraphQLSelectedAttributeByProductVariantId = require('./getGraphQLSelectedAttributeByProductVariantId');
const getGraphQLProductTypeById = require('./getGraphQLProductTypeById');
const getGraphQLCategoryById = require('./getGraphQLCategoryById');
const getGraphQLSelectedAttributesByProductId = require('./getGraphQLSelectedAttributesByProductId');
const getGraphQLCollectionById = require("./getGraphQLCollectionById");

let getGraphQLProductVariantById = (id, channel = "default-channel") => {
    return new Promise((resolve, reject) => {
        productQueries.getProductVariant([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                return reject("Product variant not found");
            }

            let productVariant = result.res[0];
            let product;
            let channelListings;
            let pricing;
            let attributes;
            let quantityOrdered;
            let defaultWeightUnit;

            console.log(productVariant);
            try {
                product = await getProductById(productVariant.product_id);
            } catch (err) {
                product = null;
            }
            console.log(product);

            try {
                channelListings = await getGraphQLProductVariantChannelListingsByVariantId(productVariant.id);
            } catch (err) {
                channelListings = null;
            }

            try {
                quantityOrdered = await getQuantityOrdered(productVariant.id);
            } catch (err) {
                quantityOrdered = null;
            }

            try {
                defaultWeightUnit = await getDefaultWeightUnit();
            } catch (err) {
                defaultWeightUnit = null;
            }


            let res = {
                id: productVariant.id,
                privateMetadata: formatMetadata(productVariant.private_metadata),
                metadata: formatMetadata(productVariant.metadata),
                name: productVariant.name,
                sku: productVariant.sku,
                product,
                trackInventory: productVariant.track_inventory,
                quantityLimitPerCustomer: productVariant.quantity_limit_per_customer,
                weight: {
                    unit: defaultWeightUnit,
                    value: productVariant.weight
                },
                channel,
                channelListings,
                margin: null,
                quantityOrdered,
                media: null,
                translation: null,
                digitalContent: null,
                quantityAvailable: null,
                preorder: {
                    globalThreshold: productVariant.preorder_global_threshold,
                    globalSoldUnits: 0,
                    endDate: productVariant.preorder_end_date
                },
                created: productVariant.created,
                updatedAt: productVariant.updated_at
            };

            console.log(res);

            resolve(res);
        });
    });
};

function getQuantityOrdered(productVariantId) {
    return new Promise(resolve => {
        productQueries.getOrderLine([productVariantId], "variant_id=$1", result => {
            if (result.err) return resolve(0);
            resolve(result.res.length);
        });
    });
}

function getDefaultWeightUnit() {
    return new Promise((resolve, reject) => {
        resolve("kg");;
    });
}


function getProductById(productId) {
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
                attributes = await getGraphQLSelectedAttributesByProductId(product.id);
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
                defaultVariant = null;
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

            console.log(res);

            resolve(res);
        });
    });
}

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

function getDefaultWeightUnit() {
    return new Promise((resolve, reject) => {
        resolve("kg");;
    });
}

module.exports = getGraphQLProductVariantById;
const { formatMetadata } = require("../../../libs/util");
const productQueries = require("../../../postgres/product-queries");
const getGraphQLProductTypeById = require('./getGraphQLProductTypeById');
const getGraphQLCategoryById = require('./getGraphQLCategoryById');
const getGraphQLSelectedAttributesByProductId = require('./getGraphQLSelectedAttributesByProductId');
const getGraphQLCollectionById = require("./getGraphQLCollectionById");

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
                defaultVariant = null;
                channelListings = null;
            } catch (err) {
                defaultVariant = null;
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

function getDefaultWeightUnit() {
    return new Promise((resolve, reject) => {
        resolve("kg");;
    });
}
module.exports = getGraphQLProductById;
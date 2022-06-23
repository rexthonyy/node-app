const productQueries = require("../../postgres/product-queries");
const getGraphQLProductTypeById = require('./getGraphQLProductTypeById');
const getGraphQLCategoryById = require('./getGraphQLCategoryById');
const getGraphQLSelectedAttributesByProductId = require('./getGraphQLSelectedAttributesByProductId');

let getGraphQLProductById = (productId) => {
    return new Promise(async(resolve, reject) => {
        productQueries.getProduct([productId], "id=$1", result => {
            if (result.err || result.res.length == 0) {
                return reject("Product not found");
            }

            let product = result.res[0];
            let productType = await getGraphQLProductTypeById(product.product_type_id);
            let category = await getGraphQLCategoryById(product.category_id);
            let defaultVariant = null;
            let channelListings = null;
            let attributes = await getGraphQLSelectedAttributesByProductId(product.id);

            let res = {
                id: product.id,
                privateMetadata: product.private_metadata,
                privateMetafield: JSON.stringify(product.private_metadata),
                privateMetafields: null,
                metadata: [product.metadata],
                metadatafield: JSON.stringify(product.metadata),
                metadatafields: null,
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
                    unit: "G",
                    value: product.weight
                },
                defaultVariant,
                rating: product.rating,
                channel: "default-channel",
                thumbnail: {
                    url: "",
                    alt: ""
                },
                pricing: null,
                isAvailable: false,
                taxType: null,
                attributes,
                channelListings,
                mediaById: null,
                variants: null,
                media: null,
                collections: null,
                translation: null,
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

module.exports = getGraphQLProductById;
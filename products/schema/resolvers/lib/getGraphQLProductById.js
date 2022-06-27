const productQueries = require("../../../postgres/product-queries");
const getGraphQLProductTypeById = require('./getGraphQLProductTypeById');
const getGraphQLCategoryById = require('./getGraphQLCategoryById');
const getGraphQLSelectedAttributesByProductId = require('./getGraphQLSelectedAttributesByProductId');

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
            try {
                productType = await getGraphQLProductTypeById(product.product_type_id);
                category = await getGraphQLCategoryById(product.category_id);
                defaultVariant = null;
                channelListings = null;
                attributes = await getGraphQLSelectedAttributesByProductId(product.id);
            } catch (err) {
                attributes = null;
                productType = null;
                category = null;
                defaultVariant = null;
                channelListings = null;
            }

            console.log("product product type");
            console.log(productType);

            let res = {
                id: product.id,
                privateMetadata: product.private_metadata,
                privateMetafield: JSON.stringify(product.private_metadata),
                privateMetafields: null,
                metadata: product.metadata,
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
                collections: [],
                translation: null,
                availableForPurchaseAt: null,
                isAvailableForPurchase: true,
                descriptionJson: {},
                imageById: null,
                images: null,
                availableForPurchase: null
            };

            console.log("product res");
            console.log(res);

            resolve(res);
        });
    });
};

module.exports = getGraphQLProductById;
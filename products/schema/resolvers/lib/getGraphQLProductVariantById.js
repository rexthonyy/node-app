const productQueries = require("../../../postgres/product-queries");
const getGraphQLProductById = require('./getGraphQLProductById');
const getGraphQLProductVariantChannelListingsByVariantId = require('./getGraphQLProductVariantChannelListingsByVariantId');
const getGraphQLVariantPricingInfoByVariantId = require('./getGraphQLVariantPricingInfoByVariantId');
const getGraphQLSelectedAttributeByProductVariantId = require('./getGraphQLSelectedAttributeByProductVariantId');

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

            try {
                product = await getGraphQLProductById(productVariant.product_id);
            } catch (err) {
                product = null;
            }

            try {
                pricing = await getGraphQLVariantPricingInfoByVariantId(productVariant.id);
            } catch (err) {
                pricing = null;
            }

            try {
                channelListings = await getGraphQLProductVariantChannelListingsByVariantId(productVariant.id);
            } catch (err) {
                channelListings = null;
            }

            try {
                attributes = await getGraphQLSelectedAttributeByProductVariantId(productVariant.id);
            } catch (err) {
                attributes = null;
            }

            try {
                quantityOrdered = await getQuantityOrdered(productVariant.id);
            } catch (err) {
                quantityOrdered = null;
            }

            let res = {
                id: productVariant.id,
                privateMetadata: productVariant.private_metadata,
                privateMetafield: JSON.stringify(productVariant.private_metadata),
                privateMetafields: null,
                metadata: productVariant.metadata,
                metadatafield: JSON.stringify(productVariant.metadata),
                metadatafields: null,
                name: productVariant.name,
                sku: productVariant.sku,
                product,
                trackInventory: productVariant.track_inventory,
                quantityLimitPerCustomer: productVariant.quantity_limit_per_customer,
                weight: {
                    unit: "G",
                    value: productVariant.weight
                },
                channel,
                channelListings,
                pricing,
                attributes,
                margin: null,
                quantityOrdered,
                revenue: null,
                media: null,
                translation: null,
                digitalContent: null,
                stocks: null,
                quantityAvailable: null,
                preorder: null,
                created: product.created,
                updatedAt: product.updated_at
            };

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

module.exports = getGraphQLProductVariantById;
const { formatMetadata } = require("../../../libs/util");
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
            let defaultWeightUnit;

            console.log(productVariant);
            try {
                product = await getGraphQLProductById(productVariant.product_id);
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
module.exports = getGraphQLProductVariantById;
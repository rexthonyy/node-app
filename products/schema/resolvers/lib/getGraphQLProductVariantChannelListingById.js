const productQueries = require("../../../postgres/product-queries");

let getGraphQLProductVariantChannelListingById = (id) => {
    return new Promise((resolve, reject) => {
        productQueries.getProductVariantChannelListing([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                return reject("Product variant channel listing not found");
            }

            let listing = result.res[0];

            let channelListing = {
                id: listing.id,
                channel: listing.channel,
                price: {
                    currency: listing.currency,
                    amount: listing.price_amount
                },
                costPrice: {
                    currency: listing.currency,
                    amount: listing.cost_price_amount
                },
                margin: 0,
                preorderThreshold: {
                    quantity: listing.preorder_quantity_threshold,
                    soldUnits: 0
                }
            };

            resolve(channelListing);
        });
    });
};

module.exports = getGraphQLProductVariantChannelListingById;
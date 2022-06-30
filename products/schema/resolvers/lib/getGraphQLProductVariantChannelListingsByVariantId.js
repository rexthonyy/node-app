const productQueries = require("../../../postgres/product-queries");
const getGraphQLProductVariantChannelListingById = require('./getGraphQLProductVariantChannelListingById');

let getGraphQLProductVariantChannelListingsByVariantId = (id) => {
    return new Promise((resolve, reject) => {
        productQueries.getProductVariantChannelListing([id], "variant_id=$1", async result => {
            if (result.err) {
                return reject(JSON.stringify(result.err));
            }

            let productVariantChannelListings = result.res;
            const numListings = productVariantChannelListings.length;
            let cursor = -1;
            let channelListings = [];

            productVariantChannelListings.forEach(async listing => {
                channelListings.push(await getGraphQLProductVariantChannelListingById(listing.id));
                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numListings) {
                    resolve(channelListings);
                }
            }
        });
    });
};

module.exports = getGraphQLProductVariantChannelListingsByVariantId;
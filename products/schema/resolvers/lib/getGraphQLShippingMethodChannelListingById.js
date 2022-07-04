const productQueries = require("../../../postgres/product-queries");
const getGraphQLChannelById = require("./getGraphQLChannelById");

let getGraphQLShippingMethodChannelListingById = (id) => {
    return new Promise((resolve, reject) => {
        productQueries.getShippingMethodChannelListings([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                reject(null);
            } else {
                let shippingMethodChannelListing = result.res[0];
                let channel = null;

                try {
                    channel = await getGraphQLChannelById(shippingMethodChannelListing.channel_id);
                } catch (err) {
                    channel = null;
                }

                let res = {
                    id: shippingMethodChannelListing.id,
                    channel,
                    maximumOrderPrice: {
                        currency: shippingMethodChannelListing.currency,
                        amount: shippingMethodChannelListing.maximum_order_price_amount
                    },
                    minimumOrderPrice: {
                        currency: shippingMethodChannelListing.currency,
                        amount: shippingMethodChannelListing.minimum_order_price_amount
                    },
                    price: {
                        currency: shippingMethodChannelListing.currency,
                        amount: shippingMethodChannelListing.price_amount
                    }
                };

                resolve(res);
            }
        });
    });
};

module.exports = getGraphQLShippingMethodChannelListingById;
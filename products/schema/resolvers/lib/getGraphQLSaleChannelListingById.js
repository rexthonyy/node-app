const productQueries = require("../../../postgres/product-queries");
const getGraphQLChannelById = require("./getGraphQLChannelById");

let getGraphQLSaleChannelListingById = (id) => {
    return new Promise((resolve, reject) => {
        productQueries.getDiscountSaleChannelListing([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                return reject("Discount sale channel listing not found");
            }

            let channelListing = result.res[0];
            let channel;
            let currency;

            try {
                channel = await getGraphQLChannelById(channelListing.channel_id);
                currency = channel.currencyCode;
            } catch (err) {
                channel = null;
                currency = "";
            }

            let res = {
                id: channelListing.id,
                channel,
                discountValue: channelListing.discount_value,
                currency,
            };

            resolve(res);
        });
    });
};

module.exports = getGraphQLSaleChannelListingById;
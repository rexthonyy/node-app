const { formatMetadata } = require("../../../libs/util");
const productQueries = require("../../../postgres/product-queries");
const getGraphQLChannelById = require("./getGraphQLChannelById");

let getGraphQLVoucherChannelListingById = (id) => {
    return new Promise((resolve, reject) => {
        productQueries.getDiscountVoucher([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                return reject("Voucher channel listing not found");
            }

            let listing = result.res[0];

            let channel;
            let currency;

            try {
                channel = await getGraphQLChannelById(listing.channel_id);
                currency = channel.currency_code;
            } catch (err) {
                channel = null;
                currency = "";
            }

            let res = {
                id: voucher.id,
                channel,
                discountValue: voucher.discount_value,
                currency,
                minSpent: {
                    currency,
                    amount: voucher.min_spent_amount
                },
            };

            resolve(res);
        });
    });
};

module.exports = getGraphQLVoucherChannelListingById;
const { formatMetadata } = require("../../../libs/util");
const productQueries = require("../../../postgres/product-queries");

let getGraphQLVoucherById = (id) => {
    return new Promise((resolve, reject) => {
        productQueries.getDiscountVoucher([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                return reject("Voucher not found");
            }

            let voucher = result.res[0];
            let discountValue = 1.0;
            let currency = "";
            let minSpent = null;
            let channelListings;

            try {
                channelListings = await getVoucherChannelListings(voucher.id);
                if (channelListings.length > 0) {
                    discountValue = channelListings[0].discountValue;
                    currency = channelListings[0].currency;
                    minSpent = channelListings[0].minSpent;
                }
            } catch (err) {
                channelListings = null;
            }

            let res = {
                id: voucher.id,
                privateMetadata: formatMetadata(voucher.private_metadata),
                metadata: formatMetadata(voucher.metadata),
                name: voucher.name,
                code: voucher.code,
                usageLimit: voucher.usage_limit,
                used: voucher.used,
                startDate: voucher.start_date,
                endDate: voucher.end_date,
                applyOncePerOrder: voucher.apply_once_per_order,
                applyOncePerCustomer: voucher.apply_once_per_customer,
                onlyForStaff: voucher.only_for_staff,
                minCheckoutItemsQuantity: voucher.min_checkout_items_quantity,
                discountValueType: voucher.discount_value_type,
                discountValue,
                currency,
                minSpent,
                type: voucher.type,
                channelListings,
            };

            resolve(res);
        });
    });
};

function getVoucherChannelListings(id) {
    return new Promise((resolve, reject) => {
        productQueries.getDiscountVoucherChannelListing([id], "voucher_id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            let channelListings_ = result.res;
            let channelListings = [];
            const numChannelListings = channelListings_.length;
            let cursor = -1;

            channelListings_.forEach(async listing => {
                try {
                    channelListings.push(await getGraphQLVoucherChannelListingById(listing.id));
                } catch (err) {}
                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numChannelListings) {
                    resolve(channelListings);
                }
            }
        });
    });
}

module.exports = getGraphQLVoucherById;
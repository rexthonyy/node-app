const { formatMetadata } = require("../../../libs/util");
const productQueries = require("../../../postgres/product-queries");
const getGraphQLSaleChannelListingById = require("./getGraphQLSaleChannelListingById");

let getGraphQLSaleById = (id) => {
    return new Promise((resolve, reject) => {
        productQueries.getDiscountSale([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                return reject("Discount sale not found");
            }

            let sale = result.res[0];
            let channelListings;

            try {
                channelListings = await getSaleChannelListingsById(sale.id);
            } catch (err) {
                channelListings = null;
            }

            let res = {
                id: sale.id,
                privateMetadata: formatMetadata(sale.private_metadata),
                metadata: formatMetadata(sale.metadata),
                name: sale.name,
                type: sale.type,
                startDate: sale.start_date,
                endDate: sale.end_date,
                created: sale.created,
                updatedAt: sale.updated_at,
                channelListings,
                discountValue: 1.0,
                currency: "",
            };

            resolve(res);
        });
    });
};

function getSaleChannelListingsById(id) {
    return new Promise((resolve, reject) => {
        productQueries.getDiscountSaleChannelListing([id], "sale_id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            let channelListings_ = result.res;
            let channelListings = [];
            const numChannelListings = channelListings_.length;
            let cursor = -1;

            channelListings_.forEach(async listing => {
                try {
                    channelListings.push(await getGraphQLSaleChannelListingById(listing.id));
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

module.exports = getGraphQLSaleById;
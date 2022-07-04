const productQueries = require("../../../postgres/product-queries");
const getGraphQLShippingMethodChannelListingById = require("./getGraphQLShippingMethodChannelListingById");
const getGraphQLShippingMethodPostalCodeRuleById = require("./getGraphQLShippingMethodPostalCodeRuleById");

let getGraphQLShippingMethodTypeById = (id) => {
    return new Promise((resolve, reject) => {
        productQueries.getShippingMethod([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                reject(null);
            } else {
                let shippingMethod = result.res[0];
                let channelListings = null;
                let shippingMethodChannelListing = null;
                let postalCodeRules;

                try {
                    channelListings = await getShippingMethodChannelListings(shippingMethod.id);
                    shippingMethodChannelListing = channelListings.length > 0 ? channelListings[0] : null;
                } catch (err) {
                    channelListings = null;
                    shippingMethodChannelListing = null;
                }

                try {
                    postalCodeRules = await getShippingMethodPostalCodeRules(shippingMethod.id);
                } catch (err) {
                    postalCodeRules = null;
                }

                let res = {
                    id: shippingMethod.id,
                    privateMetadata: shippingMethod.private_metadata,
                    privateMetafield: JSON.stringify(shippingMethod.private_metadata),
                    privateMetafields: null,
                    metadata: shippingMethod.metadata,
                    metadatafield: JSON.stringify(shippingMethod.metadata),
                    metadatafields: null,
                    name: shippingMethod.name,
                    description: shippingMethod.description,
                    type: shippingMethod.type,
                    channelListings,
                    maximumOrderPrice: {
                        currency: shippingMethodChannelListing ? shippingMethodChannelListing.currency : "",
                        amount: shippingMethodChannelListing ? shippingMethodChannelListing.maximum_order_price_amount : 1.0,
                    },
                    minimumOrderPrice: {
                        currency: shippingMethodChannelListing ? shippingMethodChannelListing.currency : "",
                        amount: shippingMethodChannelListing ? shippingMethodChannelListing.minimum_order_price_amount : 1.0,
                    },
                    postalCodeRules,
                    minimumOrderWeight: {
                        unit: "G",
                        value: shippingMethod.minimum_order_weight
                    },
                    maximumOrderWeight: {
                        unit: "G",
                        value: shippingMethod.maximum_order_weight
                    },
                    maximumDeliveryDays: shippingMethod.maximum_delivery_days,
                    minimumDeliveryDays: shippingMethod.minimum_delivery_days
                };

                resolve(res);
            }
        });
    });
};


function getShippingMethodChannelListings(id) {
    return new Promise((resolve, reject) => {
        productQueries.getShippingMethodChannelListings([id], "shipping_method_id=$1", result => {
            if (result.err) {
                reject(JSON.stringify(result.err));
            } else {
                let channelListings = result.res;
                const numChannelListings = channelListings.length;
                let cursor = -1;
                let graphQLChannelListings = [];

                channelListings.forEach(async listing => {
                    graphQLChannelListings.push(await getGraphQLShippingMethodChannelListingById(listing.id));
                    checkComplete();
                });

                checkComplete();

                function checkComplete() {
                    cursor++;
                    if (cursor == numChannelListings) {
                        resolve(graphQLChannelListings);
                    }
                }
            }
        });
    });
}

function getShippingMethodPostalCodeRules(id) {
    return new Promise((resolve, reject) => {
        productQueries.getShippingMethodPostalCodeRule([id], "shipping_method_id=$1", result => {
            if (result.err) {
                reject(JSON.stringify(result.err));
            } else {
                let postalCodeRules = result.res;
                const numPostalCodeRules = postalCodeRules.length;
                let cursor = -1;
                let graphQLPostalCodeRules = [];

                postalCodeRules.forEach(async rule => {
                    graphQLPostalCodeRules.push(await getGraphQLShippingMethodPostalCodeRuleById(rule.id));
                    checkComplete();
                });

                checkComplete();

                function checkComplete() {
                    cursor++;
                    if (cursor == numPostalCodeRules) {
                        resolve(graphQLPostalCodeRules);
                    }
                }
            }
        });
    });
}

module.exports = getGraphQLShippingMethodTypeById;
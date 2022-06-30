const productQueries = require("../../../postgres/product-queries");

let getGraphQLVariantPricingInfoByVariantId = (id) => {
    return new Promise(async(resolve, reject) => {

        let discount = null;
        let discountLocalCurrency = null;
        let price = null;
        let priceUndiscounted = null;
        let priceLocalCurrency = null;
        let discountSale;
        let variantChannelListing;

        try {
            discountSale = await getDiscountSaleChannelListing(id);
            discount = {
                currency: discountSale.currency,
                gross: {
                    currency: discountSale.currency,
                    amount: discountSale.discount_value,
                },
                net: {
                    currency: discountSale.currency,
                    amount: discountSale.discount_value,
                },
                tax: {
                    currency: discountSale.currency,
                    amount: discountSale.discount_value,
                }
            };
            discountLocalCurrency = {
                currency: discountSale.currency,
                gross: {
                    currency: discountSale.currency,
                    amount: discountSale.discount_value,
                },
                net: {
                    currency: discountSale.currency,
                    amount: discountSale.discount_value,
                },
                tax: {
                    currency: discountSale.currency,
                    amount: discountSale.discount_value,
                }
            };
        } catch (err) {
            return reject(err);
        }
        try {
            variantChannelListing = await getVariantChannelListing(id);
            price = {
                currency: variantChannelListing.currency,
                gross: {
                    currency: variantChannelListing.currency,
                    amount: variantChannelListing.price_amount,
                },
                net: {
                    currency: variantChannelListing.currency,
                    amount: variantChannelListing.price_amount,
                },
                tax: {
                    currency: variantChannelListing.currency,
                    amount: variantChannelListing.price_amount,
                }
            };

            priceUndiscounted = {
                currency: discountSale.currency,
                gross: {
                    currency: discountSale.currency,
                    amount: discountSale.discount_value,
                },
                net: {
                    currency: discountSale.currency,
                    amount: discountSale.discount_value,
                },
                tax: {
                    currency: discountSale.currency,
                    amount: discountSale.discount_value,
                }
            };

            priceLocalCurrency = {
                currency: discountSale.currency,
                gross: {
                    currency: discountSale.currency,
                    amount: discountSale.discount_value,
                },
                net: {
                    currency: discountSale.currency,
                    amount: discountSale.discount_value,
                },
                tax: {
                    currency: discountSale.currency,
                    amount: discountSale.discount_value,
                }
            };
        } catch (err) {
            return reject(err);
        }

        resolve({
            onSale: null,
            discount,
            discountLocalCurrency,
            price,
            priceUndiscounted,
            priceLocalCurrency
        });
    });
};

function getDiscountSaleChannelListing(productVariantId) {
    return new Promise((resolve, reject) => {
        productQueries.getDiscountSaleVariants([productVariantId], "productvariant_id=$1", result => {
            if (result.err || result.res.length == 0) return reject("Discount sale variants not found");
            let discountSaleVariant = result.res[0];
            productQueries.getDiscountSale([discountSaleVariant.sale_id], "id=$1", result => {
                if (result.err || result.res.length == 0) return reject("Discount sale not found");
                let discountSale = result.res[0];
                productQueries.getDiscountSaleChannelListing([discountSale.id], "sale_id=$1", result => {
                    if (result.err || result.res.length == 0) return reject("Discount sale channel listing not found");
                    let discountSaleChannelListing = result.res[0];
                    resolve(discountSaleChannelListing);
                })
            });
        });
    });
}

function getVariantChannelListing(productVariantId) {
    return new Promise((resolve, reject) => {
        productQueries.getProductVariantChannelListing([productVariantId], "variant_id=$1", result => {
            if (result.err || result.res.length == 0) return reject("Variant not found");
            let productVariant = result.res[0];
            resolve(productVariant);
        });
    });
}

module.exports = getGraphQLVariantPricingInfoByVariantId;
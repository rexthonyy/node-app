const productQueries = require("../../../postgres/product-queries");
const getGraphQLDigitalContentById = require("./getGraphQLDigitalContentById");

let getGraphQLOrderLineById = (id) => {
    return new Promise((resolve, reject) => {
        productQueries.getOrderLine([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                return reject("Order line not found");
            }

            let orderline = result.res[0];

            let digitalContentUrl;

            try {
                digitalContentUrl = await getDigitalContentUrlByLineId(orderline.id);
            } catch (err) {
                digitalContentUrl = null;
            }

            let res = {
                id: orderline.id,
                productName: orderline.product_name,
                variantName: orderline.variant_name,
                productSku: orderline.product_sku,
                productVariantId: orderline.variant_id,
                isShippingRequired: orderline.is_shipping_required,
                quantity: orderline.quantity,
                quantityFulfilled: orderline.quantity_fulfilled,
                unitDiscountReason: orderline.unit_discount_reason,
                taxRate: orderline.tax_rate,
                digitalContentUrl,
                unitPrice: null,
                undiscountedUnitPrice: null,
                unitDiscount: null,
                unDiscountValue: null,
                totalPrice: null,
                variant: null,
                translatedProductName: orderline.translated_product_name,
                translatedVariantName: orderline.translated_variant_name,
                allocations: null,
                quantityToFulfill: null,
                unitDiscountType: orderline.unit_discount_type,
            };

            resolve(res);
        });
    });
};

function getDigitalContentUrlByLineId(id) {
    return new Promise((resolve, reject) => {
        productQueries.getDigitalContentUrl([id], "line_id=$1", result => {
            if (result.err) {
                reject(JSON.stringify(result.err));
            } else {
                let digitalContentUrls = result.res;
                const numDigitalContentUrls = digitalContentUrls.length;
                let cursor = -1;
                let graphQLDigitalContentUrls = [];

                digitalContentUrls.forEach(async digitalContentUrl => {
                    let digitalContent;
                    try {
                        digitalContent = await getGraphQLDigitalContentById(digitalContentUrl.content_id);
                    } catch (err) {
                        digitalContent = null;
                    }

                    graphQLDigitalContentUrls.push({
                        id: digitalContentUrl.id,
                        content: digitalContent,
                        created: digitalContentUrl.created,
                        downloadNum: digitalContentUrl.download_num,
                        url: "",
                        token: digitalContentUrl.token
                    });
                    checkComplete();
                });

                checkComplete();

                function checkComplete() {
                    cursor++;
                    if (cursor == numDigitalContentUrls) {
                        resolve(graphQLDigitalContentUrls);
                    }
                }
            }
        });
    });
}

module.exports = getGraphQLOrderLineById;
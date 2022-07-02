const productQueries = require("../../../postgres/product-queries");
let getGraphQLShippingMethodById = (id) => {
    return new Promise((resolve, reject) => {
        productQueries.getShippingMethod([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                reject(null);
            } else {
                let shippingMethod = result.res[0];
                let translation = null;

                try {
                    translation = await getTranslation(id);
                } catch (err) {
                    translation = null;
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
                    maximumDeliveryDays: shippingMethod.maximum_delivery_days,
                    minimumDeliveryDays: shippingMethod.minimum_delivery_days,
                    translation,
                    price: null,
                    maximumOrderPrice: null,
                    minimumOrderPrice: null,
                    active: false,
                    message: "",
                    type: "",
                    maximumOrderWeight: null,
                    minimumOrderWeight: null
                };

                resolve(res);
            }
        });
    });
};


function getTranslation(id) {
    return new Promise((resolve, reject) => {
        productQueries.getShippingMethodTranslationByShippingMethodId([id], "shipping_method_id=$1", result => {
            if (result.err || result.res.length == 0) {
                reject("Shipping method translation not found");
            } else {
                let translation = result.res[0];
                resolve({
                    id: translation.id,
                    language: {
                        code: translation.language_code,
                        language: translation.name
                    },
                    name: translation.name,
                    description: translation.description
                });
            }
        });
    });
}
module.exports = getGraphQLShippingMethodById;
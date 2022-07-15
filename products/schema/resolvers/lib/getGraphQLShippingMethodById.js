const { formatMetadata } = require("../../../libs/util");
const productQueries = require("../../../postgres/product-queries");
let getGraphQLShippingMethodById = (id) => {
    return new Promise((resolve, reject) => {
        productQueries.getShippingMethod([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                reject(null);
            } else {
                let shippingMethod = result.res[0];


                let res = {
                    id: shippingMethod.id,
                    privateMetadata: formatMetadata(shippingMethod.private_metadata),
                    metadata: formatMetadata(shippingMethod.metadata),
                    name: shippingMethod.name,
                    description: shippingMethod.description,
                    maximumDeliveryDays: shippingMethod.maximum_delivery_days,
                    minimumDeliveryDays: shippingMethod.minimum_delivery_days,
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

module.exports = getGraphQLShippingMethodById;
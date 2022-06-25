const productQueries = require("../../../postgres/product-queries");
const getGraphQLProductAttributeById = require("./getGraphQLProductAttributeById");

let getGraphQLProductTypeById = (productTypeId) => {
    return new Promise((resolve, reject) => {
        productQueries.getAttributeProduct([productTypeId], "product_type_id=$1", result => {
            if (result.err || result.res.length == 0) {
                return reject("ProductTypeAttribute not found");
            }
            let productTypeAttributes = result.res;
            let productAttributes = [];
            const numProductTypeAttributes = productTypeAttributes.length;
            let cursor = -1;

            productTypeAttributes.forEach(async productAttribute => {
                productAttributes.push(await getGraphQLProductAttributeById(productAttribute.attribute_id));
                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numProductTypeAttributes) {
                    resolve(productAttributes);
                }
            }
        });
    });
};

module.exports = getGraphQLProductTypeById;
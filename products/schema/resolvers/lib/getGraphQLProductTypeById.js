const { formatMetadata } = require("../../../libs/util");
const productQueries = require("../../../postgres/product-queries");
const getGraphQLProductAttributesByProductTypeId = require("./getGraphQLProductAttributesByProductTypeId");

let getGraphQLProductTypeById = (productTypeId) => {
    return new Promise((resolve, reject) => {
        productQueries.getProductType([productTypeId], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                return reject("ProductType not found");
            }
            let productType = result.res[0];

            let productAttributes;
            let defaultWeightUnit;

            try {
                productAttributes = await getGraphQLProductAttributesByProductTypeId(productType.id);
            } catch (err) {
                productAttributes = null;
            }
            try {
                defaultWeightUnit = await getDefaultWeightUnit();
            } catch (err) {
                defaultWeightUnit = null;
            }

            let res = {
                id: productType.id,
                privateMetadata: formatMetadata(productType.private_metadata),
                metadata: formatMetadata(productType.metadata),
                name: productType.name,
                slug: productType.slug,
                hasVariants: productType.has_variants,
                isShippingRequired: productType.is_shipping_required,
                isDigital: productType.is_digital,
                weight: {
                    unit: defaultWeightUnit,
                    value: productType.weight
                },
                kind: productType.kind.toUpperCase(),
                taxType: null,
                productAttributes,
                availableAttributes: null,
                products: null,
                variantAttributes: null
            };

            resolve(res);
        });
    });
};


function getDefaultWeightUnit() {
    return new Promise((resolve, reject) => {
        resolve("kg");;
    });
}

module.exports = getGraphQLProductTypeById;
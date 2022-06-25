const productQueries = require("../../../postgres/product-queries");
const getGraphQLProductAttributesByProductTypeId = require("./getGraphQLProductAttributesByProductTypeId");

let getGraphQLProductTypeById = (productTypeId) => {
    return new Promise((resolve, reject) => {
        productQueries.getProductType([productTypeId], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                console.log("error");
                return reject("ProductType not found");
            }
            let productType = result.res[0];
            console.log(productType);
            let productAttributes = await getGraphQLProductAttributesByProductTypeId(productType.id);
            console.log(productAttributes);

            let res = {
                id: productType.id,
                privateMetadata: productType.private_metadata,
                privateMetafield: JSON.stringify(productType.private_metadata),
                privateMetafields: null,
                metadata: [productType.metadata],
                metadatafield: JSON.stringify(productType.metadata),
                metadatafields: null,
                name: productType.name,
                slug: productType.slug,
                hasVariants: productType.has_variant,
                isShippingRequired: productType.is_shipping_required,
                isDigital: productType.is_digital,
                weight: {
                    unit: "G",
                    value: productType.weight
                },
                kind: productType.kind,
                taxType: null,
                assignedVariantAttributes: null,
                productAttributes,
                availableAttributes: null,
                products: null,
                variantAttributes: null
            };

            console.log(res);

            resolve(res);
        });
    });
};

module.exports = getGraphQLProductTypeById;
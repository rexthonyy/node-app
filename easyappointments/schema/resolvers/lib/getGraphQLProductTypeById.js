const getGraphQLCategoryById = require('./getGraphQLCategoryById');
const getAttributesByProductId = require('./getAttributesByProductId');

let getGraphQLProductTypeById = (user_id) => {
    return new Promise(async(resolve, reject) => {
        let channelListings = await getChannelListingsById(1);

        let productType = {
            id: 1,
            privateMetadata: [{ key: 1, value: 2 }],
            privateMetafield: "",
            privateMetafields: null,
            metadata: [{ key: 1, value: 2 }],
            metadatafield: null,
            metadatafields: null,
            name: "accountUser.last_name",
            slug: "",
            hasVariants: false,
            isShippingRequired: false,
            isDigital,
            weight: {
                unit: "G",
                value: 1.0
            },
            kind: "NORMAL",
            taxType: null,
            assignedVariantAttributes: null,
            productAttributes: null,
            availableAttributes: null,
            products: null,
            variantAttributes: null
        };

        resolve(productType);
    });
};

module.exports = getGraphQLProductTypeById;
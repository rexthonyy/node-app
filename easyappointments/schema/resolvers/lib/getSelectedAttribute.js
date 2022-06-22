const getGraphQLCategoryById = require('./getGraphQLCategoryById');
const getAttributesByProductId = require('./getAttributesByProductId');

let getGraphQLProductVariantById = (user_id) => {
    return new Promise((resolve, reject) => {
        let attributes = await getSelectedAttribute(1);

        let selectedAttribute = {
            id: 1,
            privateMetadata: [{ key: 1, value: 2 }],
            privateMetafield: "",
            privateMetafields: null,
            metadata: [{ key: 1, value: 2 }],
            metadatafield: null,
            metadatafields: null,
            name: "accountUser.last_name",
            sku: "",
            product: null,
            trackInventory: false,
            quantityLimitPerCustomer: 1,
            weight: {
                unit: "G",
                value: 1.0
            },
            channel: "NORMAL",
            channelListings: null,
            pricing: null,
            attributes,
            margin: 1,
            quantityOrdered: 1,
            revenue: null,
            media: null,
            translation: null,
            digitalContent: null,
            stocks: null,
            quantityAvailable: 1,
            preorder: null,
            created: "2022-04-21",
            updatedAt: "2022-04-21",
            images: null,
        };

        resolve(selectedAttribute);
    });
};

module.exports = getGraphQLProductVariantById;
const getGraphQLProductTypeById = require('./getGraphQLProductTypeById');
const getGraphQLCategoryById = require('./getGraphQLCategoryById');
const getAttributesByProductId = require('./getAttributesByProductId');

let getGraphQLProductById = (user_id) => {
    return new Promise(async(resolve, reject) => {
        let productType = await getGraphQLProductTypeById(2);
        let category = await getGraphQLCategoryById(2);
        let defaultVariant = await getGraphQLProductVariantById(2);
        let channelListings = await getChannelListingsById(1);

        let product = {
            id: 1,
            privateMetadata: [{ key: 1, value: 2 }],
            privateMetafield: "",
            privateMetafields: null,
            metadata: [{ key: 1, value: 2 }],
            metadatafield: null,
            metadatafields: null,
            seoTitle: "p",
            seoDescription: "accountUser.first_name",
            name: "accountUser.last_name",
            description: "accountUser.is_staff",
            productType,
            slug: "",
            category,
            created: "2022-06-21",
            updatedAt: "2022-06-21",
            chargeTaxes: false,
            weight: {
                unit: "G",
                value: 1.0
            },
            defaultVariant,
            rating: 2.0,
            channel: "default-channel",
            thumbnail: {
                url: "",
                alt: ""
            },
            pricing: null,
            isAvailable: false,
            taxType: null,
            attributes: [{
                attribute: {
                    id: 1
                },
                values: [{
                    id: 2
                }]
            }],
            channelListings,
            mediaById: null,
            variants: null,
            media: null,
            collections: null,
            translation: null,
            availableForPurchaseAt: null,
            isAvailableForPurchase: true,
            descriptionJson: {},
            imageById: null,
            images: null,
            availableForPurchase: null
        };

        resolve(product);
    });
};

module.exports = getGraphQLProductById;
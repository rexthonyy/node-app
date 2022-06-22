let getGraphQLCategoryById = (user_id) => {
    return new Promise((resolve, reject) => {
        let channelListings = await getChannelListingsById(1);

        let category = {
            id: 1,
            privateMetadata: [{ key: 1, value: 2 }],
            privateMetafield: "",
            privateMetafields: null,
            metadata: [{ key: 1, value: 2 }],
            metadatafield: null,
            metadatafields: null,
            seoTitle: "category",
            seoDescription: "accountUser.first_name",
            name: "accountUser.last_name",
            description: "accountUser.is_staff",
            slug: "",
            parent: null,
            level: 1,
            ancestors: null,
            products: null,
            children: null,
            backgroundImage: null,
            translation: null,
            descriptionJson: null
        };

        resolve(category);
    });
};

module.exports = getGraphQLCategoryById;
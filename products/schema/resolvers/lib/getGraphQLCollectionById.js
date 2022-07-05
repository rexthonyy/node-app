const { formatMetadata } = require("../../../libs/util");
const productQueries = require("../../../postgres/product-queries");
const getGraphQLChannelById = require("./getGraphQLChannelById");

let getGraphQLCollectionById = (id, channel = "default-channel") => {
    return new Promise((resolve, reject) => {
        productQueries.getCollection([id], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                return reject("Collection not found");
            }

            let collection = result.res[0];
            let channelListings;
            try {
                channelListings = await getCollectionChannelListing(collection.id);
            } catch (err) {
                channelListings = null;
            }

            let res = {
                id: collection.id,
                privateMetadata: formatMetadata(collection.private_metadata),
                metadata: formatMetadata(collection.metadata),
                seoTitle: collection.seo_title,
                seoDescription: collection.seo_description,
                name: collection.name,
                description: collection.description,
                slug: collection.slug,
                channel,
                channelListings,
                descriptionJson: collection.description
            };

            resolve(res);
        });
    });
};


function getCollectionChannelListing(id) {
    return new Promise((resolve, reject) => {
        productQueries.getCollectionChannelListing([id], "collection_id=$1", result => {
            if (result.err) return reject(JSON.stringify(result.err));
            let collectionChannelListings = result.res;
            const numCollectionChannelListings = collectionChannelListings.length;
            let cursor = -1;
            let graphQLCollectionChannelListings = [];

            collectionChannelListings.forEach(async channelListing => {
                let channel
                try {
                    channel = getGraphQLChannelById(channelListing.channel_id);
                } catch (err) {
                    channel = null;
                }

                graphQLCollectionChannelListings.push({
                    id: channelListing.id,
                    publishedAt: channelListing.is_published ? channelListing.publication_date : null,
                    isPublished: channelListing.is_published,
                    channel,
                    publicationDate: channelListing.publication_date
                });
                checkComplete();
            });

            checkComplete();

            function checkComplete() {
                cursor++;
                if (cursor == numCollectionChannelListings) {
                    resolve(graphQLCollectionChannelListings);
                }
            }
        });
    });
}
module.exports = getGraphQLCollectionById;
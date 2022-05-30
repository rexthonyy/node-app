const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLID
} = require("graphql");


// data types
const MetadataItem = require("./MetadataItem");
const CollectionChannelListing = require("./CollectionChannelListing");
const CollectionTranslation = require("./CollectionTranslation");
const Image = require("./Image");
const ProductCountableConnection = require("./ProductCountableConnection");

module.exports = new GraphQLObjectType({
    name: "Collection",
    description: "List of collections for the product. Requires the following permissions to include the unpublished items: MANAGE_ORDERS, MANAGE_DISCOUNTS, MANAGE_PRODUCTS.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        privateMetadata: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MetadataItem))) },
        privateMetaField: { type: GraphQLString },
        privateMetaFields: { type: GraphQLString },
        metadata: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MetadataItem))) },
        metafield: { type: GraphQLString },
        metafields: { type: GraphQLString },
        seoTitle: { type: GraphQLString },
        seoDescription: { type: GraphQLString },
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        slug: { type: GraphQLNonNull(GraphQLString) },
        channel: { type: GraphQLNonNull(GraphQLString) },
        products: { type: ProductCountableConnection },
        backgroundImage: { type: Image },
        translation: { type: CollectionTranslation },
        channelListings: { type: GraphQLList(GraphQLNonNull(CollectionChannelListing)) },
        descriptionJSON: { type: GraphQLString }
    })
});
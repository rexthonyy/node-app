const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLID,
    GraphQLInt
} = require("graphql");


// data types
const MetadataItem = require("./MetadataItem");
const DigitalContentUrl = require("./DigitalContentUrl");
const ProductVariant = require("./ProductVariant");

module.exports = new GraphQLObjectType({
    name: "DigitalContent",
    description: "Digital content for the product variant. Requires one of the following permissions: MANAGE_PRODUCTS.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        privateMetadata: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MetadataItem))) },
        privateMetaField: { type: GraphQLString },
        privateMetaFields: { type: GraphQLString },
        metadata: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MetadataItem))) },
        metafield: { type: GraphQLString },
        metafields: { type: GraphQLString },
        useDefaultSettings: { type: GraphQLNonNull(GraphQLBoolean) },
        automaticFulfillment: { type: GraphQLNonNull(GraphQLBoolean) },
        contentFile: { type: GraphQLNonNull(GraphQLString) },
        maxDownloads: { type: GraphQLInt },
        urlValidDays: { type: GraphQLInt },
        urls: { type: GraphQLList(GraphQLNonNull(DigitalContentUrl)) },
        productVariant: { type: GraphQLNonNull(ProductVariant) }
    })
});
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
const Product = require("./Product");
const VariantPricingInfo = require("./VariantPricingInfo");
const TaxedMoney = require("./TaxedMoney");
const ProductVariantTranslation = require("./ProductVariantTranslation");
const DigitalContent = require("./DigitalContent");
const PreorderData = require("./PreorderData");
const SelectedAttribute = require("./SelectedAttribute");
const Stock = require("./Stock");
const ProductMedia = require("./ProductMedia");
const Weight = require("./Weight");
const ProductImage = require("./ProductImage");
const ProductVariantChannelListing = require("./ProductVariantChannelListing");

module.exports = new GraphQLObjectType({
    name: "ProductVariant",
    description: "Represents a version of a product such as different size or color.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        privateMetadata: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MetadataItem))) },
        privateMetaField: { type: GraphQLString },
        privateMetaFields: { type: GraphQLString },
        metadata: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MetadataItem))) },
        metafield: { type: GraphQLString },
        metafields: { type: GraphQLString },
        name: { type: GraphQLString },
        sku: { type: GraphQLString },
        product: { type: GraphQLNonNull(Product) },
        trackInventory: { type: GraphQLNonNull(GraphQLBoolean) },
        quantityLimitPerCustomer: { type: GraphQLInt },
        weight: { type: Weight },
        channel: { type: GraphQLString },
        channelListings: { type: GraphQLList(GraphQLNonNull(ProductVariantChannelListing)) },
        pricing: { type: VariantPricingInfo },
        attributes: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(SelectedAttribute))) },
        margin: { type: GraphQLInt },
        quantityOrdered: { type: GraphQLInt },
        revenue: { type: TaxedMoney },
        media: { type: GraphQLList(GraphQLNonNull(ProductMedia)) },
        translation: { type: ProductVariantTranslation },
        digitalContent: { type: DigitalContent },
        stocks: { type: GraphQLList(GraphQLNonNull(Stock)) },
        quantityAvailable: { type: GraphQLInt },
        preorder: { type: PreorderData },
        created: { type: GraphQLString },
        updatedAt: { type: GraphQLString },
        images: { type: GraphQLList(GraphQLNonNull(ProductImage)) }
    })
});
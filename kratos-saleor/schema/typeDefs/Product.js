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
const ProductType = require("./ProductType");
const Category = require("./Category");
const Weight = require("./Weight");
const ProductVariant = require("./ProductVariant");
const Channel = require("./Channel");
const ProductPricingInfo = require("./ProductPricingInfo");
const TaxType = require("./TaxType");
const SelectedAttribute = require("./SelectedAttribute");
const ProductChannelListing = require("./ProductChannelListing");
const ProductMedia = require("./ProductMedia");
const Collection = require("./Collection");
const ProductTranslation = require("./ProductTranslation");
const ProductImage = require("./ProductImage");
const Image = require("./Image");

module.exports = new GraphQLObjectType({
    name: "Product",
    description: "Represents an individual item for sale in the storefront.",
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
        productType: { type: GraphQLNonNull(ProductType) },
        slug: { type: GraphQLNonNull(GraphQLString) },
        category: { type: Category },
        created: { type: GraphQLString },
        updatedAt: { type: GraphQLString },
        chargeTaxes: { type: GraphQLNonNull(GraphQLBoolean) },
        weight: { type: Weight },
        defaultVariant: { type: ProductVariant },
        rating: { type: GraphQLFloat },
        channel: { type: Channel },
        thumbnail: { type: Image },
        pricing: { type: ProductPricingInfo },
        isAvailable: { type: GraphQLBoolean },
        taxType: { type: TaxType },
        attributes: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(SelectedAttribute))) },
        channelListings: { type: GraphQLList(GraphQLNonNull(ProductChannelListing)) },
        mediaById: { type: ProductMedia },
        variants: { type: GraphQLList(GraphQLNonNull(ProductVariant)) },
        media: { type: GraphQLList(GraphQLNonNull(ProductMedia)) },
        collections: { type: GraphQLList(GraphQLNonNull(Collection)) },
        translation: { type: ProductTranslation },
        availableForPurchaseAt: { type: GraphQLString },
        isAvailableForPurchase: { type: GraphQLBoolean },
        descriptionJSON: { type: GraphQLString },
        imageById: { type: ProductImage },
        images: { type: GraphQLList(GraphQLNonNull(ProductImage)) },
        availableForPurchase: { type: GraphQLString }

    })
});
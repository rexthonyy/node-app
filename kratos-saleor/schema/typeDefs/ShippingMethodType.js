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
const ShippingMethodTranslation = require("./ShippingMethodTranslation");
const ShippingMethodChannelListing = require("./ShippingMethodChannelListing");
const ShippingMethodPostalCodeRule = require("./ShippingMethodPostalCodeRule");
const ProductCountableConnection = require("./ProductCountableConnection");
const Money = require("./Money");
const Weight = require("./Weight");

module.exports = new GraphQLObjectType({
    name: "ShippingMethodType",
    description: "Shipping method are the methods you'll use to get customer's orders to them. They are directly exposed to the customers.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        privateMetadata: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MetadataItem))) },
        privateMetaField: { type: GraphQLString },
        privateMetaFields: { type: GraphQLString },
        metadata: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MetadataItem))) },
        metafield: { type: GraphQLString },
        metafields: { type: GraphQLString },
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        type: { type: GraphQLString },
        translation: { type: ShippingMethodTranslation },
        channelListings: { type: GraphQLNonNull(ShippingMethodChannelListing) },
        maximumOrderPrice: { type: Money },
        minimumOrderPrice: { type: Money },
        postalCodeRules: { type: GraphQLList(GraphQLNonNull(ShippingMethodPostalCodeRule)) },
        excluedProducts: { type: ProductCountableConnection },
        minimumOrderWeight: { type: Weight },
        maximumOrderWeight: { type: Weight },
        maximumDeliveryDays: { type: GraphQLInt },
        minimumDeliveryDays: { type: GraphQLInt }
    })
});
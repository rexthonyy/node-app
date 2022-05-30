const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLInt,
    GraphQLID,
    GraphQLFloat
} = require("graphql");

// data types
const MetadataItem = require("./MetadataItem");
const ShippingMethodTranslation = require("./ShippingMethodTranslation");
const Money = require("./Money");
const Weight = require("./Weight");

module.exports = new GraphQLObjectType({
    name: "ShippingMethod",
    description: "Shipping methods that can be used as means of shipping for orders and checkouts.",
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
        maximumDeliveryDays: { type: GraphQLInt },
        minimumDeliveryDays: { type: GraphQLInt },
        translation: { type: ShippingMethodTranslation },
        price: { type: GraphQLNonNull(Money) },
        maximumOrderPrice: { type: Money },
        minimumOrderPrice: { type: Money },
        active: { type: GraphQLNonNull(GraphQLBoolean) },
        message: { type: GraphQLString },
        type: { type: GraphQLString },
        maximumOrderWeight: { type: Weight },
        minimumOrderWeight: { type: Weight }
    })
});
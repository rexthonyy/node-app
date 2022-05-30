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
const CountryDisplay = require("./CountryDisplay");
const MetadataItem = require("./MetadataItem");
const Warehouse = require("./Warehouse");
const ShippingMethodType = require("./ShippingMethodType");
const Channel = require("./Channel");
const MoneyRange = require("./MoneyRange");

module.exports = new GraphQLObjectType({
    name: "ShippingZoneCountableEdge",
    description: "Represents a shipping zone in the shop. Zones are the concept used only for grouping shipping methods in the dashboard, and are never exposed to the customers directly.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        privateMetadata: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MetadataItem))) },
        privateMetaField: { type: GraphQLString },
        privateMetaFields: { type: GraphQLString },
        metadata: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MetadataItem))) },
        metafield: { type: GraphQLString },
        metafields: { type: GraphQLString },
        name: { type: GraphQLNonNull(GraphQLString) },
        default: { type: GraphQLNonNull(GraphQLBoolean) },
        priceRange: { type: MoneyRange },
        countries: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(CountryDisplay))) },
        shippingMethods: { type: GraphQLList(GraphQLNonNull(ShippingMethodType)) },
        warehouses: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(Warehouse))) },
        channels: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(Channel))) },
        description: { type: GraphQLString }

    })
});
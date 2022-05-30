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
const Address = require("./Address");
const ShippingZoneCountableConnection = require("./ShippingZoneCountableConnection");

module.exports = new GraphQLObjectType({
    name: "Warehouse",
    description: "Represents warehouse.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        privateMetadata: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MetadataItem))) },
        privateMetaField: { type: GraphQLString },
        privateMetaFields: { type: GraphQLString },
        metadata: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MetadataItem))) },
        metafield: { type: GraphQLString },
        metafields: { type: GraphQLString },
        name: { type: GraphQLNonNull(GraphQLString) },
        slug: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        isPrivate: { type: GraphQLNonNull(GraphQLBoolean) },
        address: { type: GraphQLNonNull(Address) },
        clickAndCollectOption: { type: GraphQLNonNull(GraphQLString) },
        shippingZones: { type: GraphQLNonNull(ShippingZoneCountableConnection) },
        companyName: { type: GraphQLNonNull(GraphQLString) }
    })
});
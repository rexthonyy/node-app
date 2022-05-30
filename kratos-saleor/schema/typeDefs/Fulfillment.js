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
const FulfillmentLine = require("./FulfillmentLine");
const Warehouse = require("./Warehouse");

module.exports = new GraphQLObjectType({
    name: "Fulfillment",
    description: "Represents order fulfillment.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        privateMetadata: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MetadataItem))) },
        privateMetaField: { type: GraphQLString },
        privateMetaFields: { type: GraphQLString },
        metadata: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MetadataItem))) },
        metafield: { type: GraphQLString },
        metafields: { type: GraphQLString },
        fulfillmentOrder: { type: GraphQLNonNull(GraphQLInt) },
        status: { type: GraphQLNonNull(GraphQLString) },
        trackingNumber: { type: GraphQLNonNull(GraphQLString) },
        created: { type: GraphQLNonNull(GraphQLString) },
        lines: { type: GraphQLList(GraphQLNonNull(FulfillmentLine)) },
        statusDisplay: { type: GraphQLString },
        warehouse: { type: Warehouse }
    })
});
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
const ShippingZone = require("./ShippingZone");

module.exports = new GraphQLObjectType({
    name: "ShippingZoneCountableEdge",
    fields: () => ({
        node: { type: GraphQLNonNull(ShippingZone) },
        cursor: { type: GraphQLString }
    })
});
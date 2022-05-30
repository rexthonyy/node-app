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
const OrderLine = require("./OrderLine");

module.exports = new GraphQLObjectType({
    name: "FulfillmentLine",
    description: "Represents line of the fulfillment.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        quantity: { type: GraphQLNonNull(GraphQLInt) },
        orderLine: { type: OrderLine }
    })
});
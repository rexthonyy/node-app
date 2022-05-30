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
const Money = require("./Money");
const Channel = require("./Channel");

module.exports = new GraphQLObjectType({
    name: "ShippingMethodChannelListing",
    description: "Shipping method are the methods you'll use to get customer's orders to them. They are directly exposed to the customers.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        channel: { type: GraphQLNonNull(Channel) },
        maximumOrderPrice: { type: Money },
        minimumOrderPrice: { type: Money },
        price: { type: Money }
    })
});
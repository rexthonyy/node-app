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
const ProductVariant = require("./ProductVariant");
const TaxedMoney = require("./TaxedMoney");

module.exports = new GraphQLObjectType({
    name: "CheckoutLine",
    description: "Represents an item in the checkout.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        variant: { type: GraphQLNonNull(ProductVariant) },
        quantity: { type: GraphQLNonNull(GraphQLInt) },
        totalMoney: { type: GraphQLNonNull(TaxedMoney) },
        requiresShipping: { type: GraphQLNonNull(GraphQLBoolean) }
    })
});
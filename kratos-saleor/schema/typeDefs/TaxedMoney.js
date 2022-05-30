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

module.exports = new GraphQLObjectType({
    name: "TaxedMoney",
    description: "Represents a monetary value with taxes. In cases where taxes were not applied, net and gross values will be equal.",
    args: {
        period: { type: GraphQLString }
    },
    fields: () => ({
        currency: { type: GraphQLNonNull(GraphQLString) },
        gross: { type: GraphQLNonNull(Money) },
        net: { type: GraphQLNonNull(Money) },
        tax: { type: GraphQLNonNull(Money) },
    })
});
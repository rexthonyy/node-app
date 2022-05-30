const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLID,
    GraphQLFloat
} = require("graphql");

// data types
const ReducedRates = require("./ReducedRates");

module.exports = new GraphQLObjectType({
    name: "VAT",
    description: "Country tax.",
    fields: () => ({
            countryCode: { type: GraphQLNonNull(GraphQLString) },
            standardRate: { type: GraphQLFloat },
            reducedRates: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(ReducedRates))) }
    })
});
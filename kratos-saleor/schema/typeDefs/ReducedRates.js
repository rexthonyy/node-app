const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLID,
    GraphQLFloat
} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "ReducedRates",
    description: "Represents a reduced VAT rate for a particular type of goods.",
    fields: () => ({
            rate: { type: GraphQLFloat },
            rateType: { type: GraphQLNonNull(GraphQLString) }
    })
});
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

module.exports = new GraphQLObjectType({
    name: "Channel",
    description: "Represents channel.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLNonNull(GraphQLString) },
        isActive: { type: GraphQLNonNull(GraphQLBoolean) },
        currencyCode: { type: GraphQLNonNull(GraphQLString) },
        slug: { type: GraphQLNonNull(GraphQLString) },
        hasOrders: { type: GraphQLNonNull(GraphQLBoolean) },
        defaultCountry: { type: GraphQLNonNull(CountryDisplay) }
    })
});
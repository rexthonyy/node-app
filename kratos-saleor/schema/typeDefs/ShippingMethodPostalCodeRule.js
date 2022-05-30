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

module.exports = new GraphQLObjectType({
    name: "ShippingMethodPostalCodeRule",
    description: "Postal code ranges rule of exclusion or inclusion of the shipping method.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        start: { type: GraphQLString },
        end: { type: GraphQLString },
        inclusionType: { type: GraphQLString }
    })
});
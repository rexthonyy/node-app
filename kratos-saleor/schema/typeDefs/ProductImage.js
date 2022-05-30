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
    name: "ProductImage",
    description: "Represents a product image.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        alt: { type: GraphQLString },
        sortOrder: { type: GraphQLInt },
        url: { type: GraphQLNonNull(GraphQLString) }
    })
});
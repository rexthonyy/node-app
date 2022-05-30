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

const Product = require("./Product");

module.exports = new GraphQLObjectType({
    name: "ProductCountableEdge",
    description: "List of excluded products for the shipping method. Requires one of the following permissions: MANAGE_SHIPPING.",
    fields: () => ({
        node: { type: GraphQLNonNull(Product) },
        cursor: { type: GraphQLString }
    })
});
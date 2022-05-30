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
const ProductType = require("./ProductType");


module.exports = new GraphQLObjectType({
    name: "ProductTypeCountableEdge",
    fields: () => ({
        node: { type: GraphQLNonNull(ProductType) },
        cursor: { type: GraphQLString }
    })
});
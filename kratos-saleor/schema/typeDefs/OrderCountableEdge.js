const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLBoolean,
    GraphQLInt
} = require("graphql");

// data types
const Order = require("./Order");

module.exports = new GraphQLObjectType({
    name: "OrderCountableEdge",
    fields: () => ({
        node: { type: GraphQLNonNull(Order) },
        cursor: { type: GraphQLString }
    })
});
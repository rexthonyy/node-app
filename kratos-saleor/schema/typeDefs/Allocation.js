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
const Warehouse = require("./Warehouse");

module.exports = new GraphQLObjectType({
    name: "Allocation",
    description: "List of allocations across warehouses. Requires one of the following permissions: MANAGE_PRODUCTS, MANAGE_ORDERS.",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        quantity: { type: GraphQLNonNull(GraphQLInt) },
        warehouse: { type: GraphQLNonNull(Warehouse) }
    })
});